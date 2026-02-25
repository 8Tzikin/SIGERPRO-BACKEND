#!/usr/bin/env python3
"""
Script para sincronizar la tabla 'usuarios' en TiDB con el esquema Drizzle.
Agrega columnas faltantes y ajusta la estructura.
"""

import os
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """Crear conexión a la base de datos TiDB"""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL no está configurada")
    
    # Parsear URL: mysql://user:password@host:port/database?ssl_mode=REQUIRED
    # Formato: mysql://user:password@host:port/database
    parts = db_url.replace('mysql://', '').split('@')
    user_pass = parts[0].split(':')
    host_db = parts[1].split('/')
    host_port = host_db[0].split(':')
    
    user = user_pass[0]
    password = user_pass[1]
    host = host_port[0]
    port = int(host_port[1]) if len(host_port) > 1 else 3306
    database = host_db[1].split('?')[0]
    
    print(f"Conectando a {host}:{port}/{database} como {user}...")
    
    try:
        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl_disabled=False,
            autocommit=False
        )
        return connection
    except Error as e:
        print(f"Error de conexión: {e}")
        raise

def get_table_columns(cursor, table_name):
    """Obtener lista de columnas de una tabla"""
    cursor.execute(f"DESCRIBE {table_name}")
    columns = {}
    for row in cursor.fetchall():
        col_name = row[0]
        col_type = row[1]
        columns[col_name] = col_type
    return columns

def sync_usuarios_table(connection):
    """Sincronizar tabla usuarios con esquema Drizzle"""
    cursor = connection.cursor()
    
    try:
        print("\n=== Sincronizando tabla 'usuarios' ===\n")
        
        # Obtener columnas actuales
        current_columns = get_table_columns(cursor, 'usuarios')
        print(f"Columnas actuales: {list(current_columns.keys())}")
        
        # Columnas esperadas según Drizzle schema
        expected_columns = {
            'id': 'INT AUTO_INCREMENT PRIMARY KEY',
            'openId': 'VARCHAR(64) UNIQUE NOT NULL',
            'nombre': 'TEXT',
            'correo': 'VARCHAR(320)',
            'loginMethod': 'VARCHAR(64)',
            'role': "ENUM('user', 'admin') DEFAULT 'user' NOT NULL",
            'createdAt': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
            'updatedAt': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL',
            'lastSignedIn': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
        }
        
        # Agregar columnas faltantes
        for col_name, col_type in expected_columns.items():
            if col_name not in current_columns:
                print(f"Agregando columna: {col_name} ({col_type})")
                try:
                    if col_name == 'id':
                        # No agregar id si no existe, es la clave primaria
                        continue
                    cursor.execute(f"ALTER TABLE usuarios ADD COLUMN {col_name} {col_type}")
                    connection.commit()
                    print(f"✓ Columna {col_name} agregada exitosamente")
                except Error as e:
                    print(f"✗ Error al agregar {col_name}: {e}")
                    connection.rollback()
        
        # Verificar estructura final
        print("\n=== Estructura final ===")
        final_columns = get_table_columns(cursor, 'usuarios')
        for col_name, col_type in final_columns.items():
            print(f"  {col_name}: {col_type}")
        
        print("\n✓ Sincronización completada")
        
    except Error as e:
        print(f"Error durante sincronización: {e}")
        connection.rollback()
        raise
    finally:
        cursor.close()

if __name__ == '__main__':
    try:
        connection = get_db_connection()
        sync_usuarios_table(connection)
        connection.close()
        print("\n✓ Conexión cerrada")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        exit(1)
