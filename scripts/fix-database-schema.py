#!/usr/bin/env python3
"""
Script para sincronizar la estructura de la base de datos con el esquema Drizzle
Resuelve problemas de columnas faltantes o mal nombradas
"""

import os
import sys
import mysql.connector
from mysql.connector import Error

def get_connection():
    """Conectar a la base de datos"""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("ERROR: DATABASE_URL no está configurado")
        sys.exit(1)
    
    # Parse connection string: mysql://user:password@host/database
    try:
        parts = db_url.replace('mysql://', '').split('@')
        user_pass = parts[0].split(':')
        host_db = parts[1].split('/')
        
        user = user_pass[0]
        password = user_pass[1]
        host = host_db[0]
        database = host_db[1]
        
        conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            ssl_disabled=False,
            autocommit=True
        )
        return conn
    except Exception as e:
        print(f"ERROR al conectar: {e}")
        sys.exit(1)

def get_table_columns(conn, table_name):
    """Obtener columnas de una tabla"""
    cursor = conn.cursor()
    try:
        cursor.execute(f"DESCRIBE {table_name}")
        columns = {}
        for row in cursor.fetchall():
            col_name = row[0]
            col_type = row[1]
            columns[col_name] = col_type
        return columns
    finally:
        cursor.close()

def fix_usuarios_table(conn):
    """Arreglar tabla usuarios"""
    print("\n=== Sincronizando tabla 'usuarios' ===")
    
    cursor = conn.cursor()
    try:
        columns = get_table_columns(conn, 'usuarios')
        print(f"Columnas actuales: {list(columns.keys())}")
        
        # Verificar si 'correo' existe, si no, renombrar 'email' o crear
        if 'correo' not in columns:
            if 'email' in columns:
                print("✓ Renombrando 'email' a 'correo'...")
                cursor.execute("ALTER TABLE usuarios CHANGE COLUMN email correo VARCHAR(255)")
                print("✓ Columna 'correo' creada")
            else:
                print("✓ Agregando columna 'correo'...")
                cursor.execute("ALTER TABLE usuarios ADD COLUMN correo VARCHAR(255) DEFAULT NULL")
                print("✓ Columna 'correo' agregada")
        else:
            print("✓ Columna 'correo' ya existe")
        
        # Verificar 'nombre'
        if 'nombre' not in columns:
            if 'name' in columns:
                print("✓ Renombrando 'name' a 'nombre'...")
                cursor.execute("ALTER TABLE usuarios CHANGE COLUMN name nombre VARCHAR(255)")
            else:
                print("✓ Agregando columna 'nombre'...")
                cursor.execute("ALTER TABLE usuarios ADD COLUMN nombre VARCHAR(255) DEFAULT NULL")
        else:
            print("✓ Columna 'nombre' ya existe")
        
        # Verificar 'openId'
        if 'openId' not in columns:
            print("✓ Agregando columna 'openId'...")
            cursor.execute("ALTER TABLE usuarios ADD COLUMN openId VARCHAR(64) UNIQUE NOT NULL")
        else:
            print("✓ Columna 'openId' ya existe")
        
        print("✓ Tabla 'usuarios' sincronizada correctamente")
        
    except Error as e:
        print(f"ERROR: {e}")
        raise
    finally:
        cursor.close()

def main():
    print("Iniciando sincronización de esquema de base de datos...")
    
    try:
        conn = get_connection()
        print("✓ Conectado a la base de datos")
        
        fix_usuarios_table(conn)
        
        print("\n✓ Sincronización completada exitosamente")
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Error durante la sincronización: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
