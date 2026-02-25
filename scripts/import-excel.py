#!/usr/bin/env python3
"""
SIGER PRO Excel Importer
Imports evaluation data from Excel MATRIZ sheet
"""

import os
import sys
import mysql.connector
from mysql.connector import Error
from urllib.parse import urlparse
import openpyxl
from datetime import datetime

# Parse DATABASE_URL
db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("❌ Error: DATABASE_URL not set")
    sys.exit(1)

parsed = urlparse(db_url)
config = {
    'host': parsed.hostname,
    'user': parsed.username,
    'password': parsed.password,
    'database': parsed.path.lstrip('/'),
    'port': parsed.port or 3306,
    'ssl_disabled': False,
}

print("🚀 SIGER PRO Excel Importer")
print("=" * 50)

# Connect
try:
    print("\n📊 Connecting to database...")
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    print("✓ Connected")
except Error as err:
    print(f"❌ Connection error: {err}")
    sys.exit(1)

# Load Excel
excel_file = '/home/ubuntu/upload/EVALUACIONESRIESGOAGAREPORTES2025.xlsx'

if not os.path.exists(excel_file):
    print(f"❌ File not found: {excel_file}")
    sys.exit(1)

print(f"\n📄 Loading Excel: {excel_file}")
wb = openpyxl.load_workbook(excel_file)
ws = wb['MATRIZ']

print(f"✓ Sheet 'MATRIZ' loaded")

# Get all data
print("\n📊 Reading data...")
rows = list(ws.iter_rows(values_only=True))
print(f"✓ Total rows: {len(rows)}")

# Get headers from first row
headers = rows[0]
print(f"✓ Headers: {headers}")

# Find column indices
col_map = {}
for idx, header in enumerate(headers):
    if header:
        header_str = str(header).upper()
        col_map[header_str] = idx

print(f"✓ Found {len(col_map)} columns")

# Import data
print("\n📥 Importing data...")
imported = 0
skipped = 0
errors = 0

for row_idx, row in enumerate(rows[1:], 2):
    try:
        # Extract values
        numero = None
        fecha = datetime.now()
        forma_reporte = None
        reportado_por = None
        entidad_origen = None
        descripcion = ""
        tipo_ocurrencia = None
        regulacion = None
        probabilidad = 1
        severidad_id = 1
        
        # Map columns
        for header_key, col_idx in col_map.items():
            if col_idx >= len(row):
                continue
            
            value = row[col_idx]
            if not value:
                continue
            
            value_str = str(value).strip()
            
            if 'NO.' in header_key or 'NUMERO' in header_key:
                numero = value_str
            elif 'FECHA' in header_key:
                if isinstance(value, datetime):
                    fecha = value
            elif 'FORMA' in header_key and 'REPORTE' in header_key:
                forma_reporte = value_str[:100]
            elif 'PRESENTADO' in header_key or 'REPORTE' in header_key and 'POR' in header_key:
                reportado_por = value_str[:255]
            elif 'ENTIDAD' in header_key or 'ORIGEN' in header_key:
                entidad_origen = value_str[:255]
            elif 'REPORTE' in header_key and 'TEXTO' in header_key:
                descripcion = value_str[:1000]
            elif 'TIPO' in header_key and 'OCURRENCIA' in header_key:
                tipo_ocurrencia = value_str[:100]
            elif 'REGULACION' in header_key or 'REGULACIÓN' in header_key:
                regulacion = value_str[:100]
            elif 'PROBABILIDAD' in header_key:
                try:
                    prob_str = value_str.upper()
                    if prob_str in ['1', 'REMOTO']:
                        probabilidad = 1
                    elif prob_str in ['2', 'OCASIONAL']:
                        probabilidad = 2
                    elif prob_str in ['3', 'PROBABLE']:
                        probabilidad = 3
                    elif prob_str in ['4', 'FRECUENTE']:
                        probabilidad = 4
                    else:
                        probabilidad = int(float(prob_str))
                except:
                    probabilidad = 1
            elif 'SEVERIDAD' in header_key:
                try:
                    sev_str = value_str.upper()
                    if sev_str in ['A', '1']:
                        severidad_id = 1
                    elif sev_str in ['B', '2']:
                        severidad_id = 2
                    elif sev_str in ['C', '3']:
                        severidad_id = 3
                    elif sev_str in ['D', '4']:
                        severidad_id = 4
                    elif sev_str in ['E', '5']:
                        severidad_id = 5
                    else:
                        severidad_id = int(float(sev_str))
                except:
                    severidad_id = 1
        
        # Validate
        if not numero:
            skipped += 1
            continue
        
        if not descripcion or len(descripcion) < 5:
            descripcion = f"Reporte {numero}"
        
        # Calculate risk
        riesgo_inherente = probabilidad * severidad_id
        if riesgo_inherente <= 5:
            clasificacion_id = 1
        elif riesgo_inherente <= 10:
            clasificacion_id = 2
        elif riesgo_inherente <= 15:
            clasificacion_id = 3
        else:
            clasificacion_id = 4
        
        # Check if exists
        cursor.execute("SELECT id FROM evaluaciones WHERE numeroReporte = %s", (numero,))
        if cursor.fetchone():
            skipped += 1
            continue
        
        # Insert
        cursor.execute("""
            INSERT INTO evaluaciones (
                numeroReporte, fecha, formaReporte, reportadoPor, entidadOrigen,
                descripcion, tipoOcurrencia, regulacion, probabilidad, severidadId,
                riesgoInherente, clasificacionId, estado, creadoPor
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            numero, fecha, forma_reporte, reportado_por, entidad_origen,
            descripcion, tipo_ocurrencia, regulacion, probabilidad, severidad_id,
            riesgo_inherente, clasificacion_id, 'ABIERTO', 1
        ))
        
        imported += 1
        if imported % 50 == 0:
            print(f"  {imported} records imported...")
        
    except Exception as e:
        errors += 1
        if errors <= 5:
            print(f"  ⚠️  Row {row_idx}: {str(e)[:80]}")

conn.commit()

print(f"\n✅ Import Summary")
print("=" * 50)
print(f"✓ Imported: {imported} records")
print(f"⊘ Skipped: {skipped} records")
if errors > 0:
    print(f"✗ Errors: {errors} records")

# Verify
try:
    cursor.execute("SELECT COUNT(*) FROM evaluaciones")
    total = cursor.fetchone()[0]
    print(f"\n✓ Total evaluations in database: {total}")
except:
    pass

cursor.close()
conn.close()

print("\n✅ Import completed!\n")
