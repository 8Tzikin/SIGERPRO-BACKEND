import XLSX from 'xlsx';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
  enableKeepAlive: true,
};

async function migrateData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }

  try {
    console.log('Reading Excel file...');
    const workbook = XLSX.read(fs.readFileSync('/home/ubuntu/upload/EVALUACIONESRIESGOAGAREPORTES2025.xlsx'), { type: 'buffer' });

    // ============================================
    // MIGRATE NORMATIVA
    // ============================================
    console.log('\n=== Migrating NORMATIVA ===');
    const normativaSheet = workbook.Sheets['NORMATIVA'];
    const normativaData = XLSX.utils.sheet_to_json(normativaSheet);

    const normativaMap = new Map();
    for (const row of normativaData) {
      if (!row.DESCRIPCION || !row['NORMATIVA AAC']) continue;

      const codigo = row['NORMATIVA AAC'].toString().split(' ')[0];
      const nombre = row['NORMATIVA AAC'].toString();
      const tipo = codigo.startsWith('RAC') ? 'RAC' : codigo.startsWith('NSOAM') ? 'NSOAM' : 'AIES-SOARG';

      if (!normativaMap.has(codigo)) {
        try {
          const result = await connection.execute(
            'INSERT INTO normativa (codigo, nombre, tipo, activa) VALUES (?, ?, ?, true)',
            [codigo, nombre, tipo]
          );
          normativaMap.set(codigo, result[0].insertId);
          console.log(`✓ Inserted normativa: ${codigo}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`Error inserting normativa ${codigo}:`, err.message);
          }
        }
      }
    }

    // ============================================
    // MIGRATE PROVEEDORES
    // ============================================
    console.log('\n=== Migrating PROVEEDORES ===');
    const proveedoresSheet = workbook.Sheets['PROVEEDORES'];
    const proveedoresData = XLSX.utils.sheet_to_json(proveedoresSheet);

    const proveedoresMap = new Map();
    for (const row of proveedoresData) {
      if (!row.EMPRESA) continue;

      const nombre = row.EMPRESA.toString().trim();
      if (!nombre || proveedoresMap.has(nombre)) continue;

      try {
        const result = await connection.execute(
          'INSERT INTO proveedores (nombre, contacto, activo) VALUES (?, ?, true)',
          [nombre, row.NOMBRE?.toString() || null]
        );
        proveedoresMap.set(nombre, result[0].insertId);
        console.log(`✓ Inserted proveedor: ${nombre}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting proveedor ${nombre}:`, err.message);
        }
      }
    }

    // ============================================
    // MIGRATE EVALUACIONES
    // ============================================
    console.log('\n=== Migrating EVALUACIONES ===');
    const matrizSheet = workbook.Sheets['MATRIZ'];
    const matrizData = XLSX.utils.sheet_to_json(matrizSheet, { header: 1 });

    // Find header row
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(10, matrizData.length); i++) {
      if (matrizData[i][1] === 'NO.') {
        headerRowIndex = i;
        break;
      }
    }

    const headers = matrizData[headerRowIndex];
    let evaluacionCount = 0;

    for (let i = headerRowIndex + 1; i < matrizData.length; i++) {
      const row = matrizData[i];
      if (!row[1] || !row[2]) continue; // Skip empty rows

      try {
        const numeroReporte = `REP-${row[1]}`;
        const fecha = row[2] instanceof Date ? row[2] : new Date(row[2]);
        const formaReporte = row[3]?.toString() || null;
        const reportadoPor = row[4]?.toString() || null;
        const entidadOrigen = row[5]?.toString() || null;
        const descripcion = row[6]?.toString() || null;
        const tipoOcurrencia = row[8]?.toString() || null;
        const regulacion = row[9]?.toString() || null;

        // Parse probability (column 12)
        const probStr = row[12]?.toString().trim().toLowerCase() || '';
        let probabilidad = 3; // default
        if (probStr.includes('remoto') || probStr.includes('improbable')) probabilidad = 1;
        else if (probStr.includes('ocasional')) probabilidad = 2;
        else if (probStr.includes('frecuente')) probabilidad = 4;

        // Parse severity (column 14)
        const sevStr = row[14]?.toString().trim().toUpperCase() || '';
        let severidadId = 3; // default to C (Moderada)
        if (sevStr.includes('INSIGNIFICANTE')) severidadId = 1; // A
        else if (sevStr.includes('MENOR')) severidadId = 2; // B
        else if (sevStr.includes('MODERADA')) severidadId = 3; // C
        else if (sevStr.includes('MAYOR')) severidadId = 4; // D
        else if (sevStr.includes('CRÍTICA')) severidadId = 5; // E

        const impacto = 1; // Default impact
        const riesgoInherente = probabilidad * impacto;

        // Get classification
        let clasificacionId = 1; // default to BAJO
        if (riesgoInherente >= 1 && riesgoInherente <= 5) clasificacionId = 1; // BAJO
        else if (riesgoInherente >= 6 && riesgoInherente <= 10) clasificacionId = 2; // MEDIO
        else if (riesgoInherente >= 11 && riesgoInherente <= 15) clasificacionId = 3; // ALTO
        else if (riesgoInherente >= 16) clasificacionId = 4; // CRÍTICO

        // Get normativa ID
        const normCodigo = regulacion?.toString().split(' ')[0];
        const normativaId = normativaMap.has(normCodigo) ? normativaMap.get(normCodigo) : null;

        // Get proveedor ID
        const proveedorId = entidadOrigen ? proveedoresMap.get(entidadOrigen) : null;

        const estado = 'ABIERTO';

        await connection.execute(
          `INSERT INTO evaluaciones 
          (numeroReporte, fecha, formaReporte, reportadoPor, entidadOrigen, descripcion, 
           tipoOcurrencia, regulacion, normativaId, proveedorId, probabilidad, severidadId, 
           impacto, riesgoInherente, clasificacionId, estado, creadoPor, fechaCreacion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [numeroReporte, fecha, formaReporte ?? null, reportadoPor ?? null, entidadOrigen ?? null, descripcion ?? null,
           tipoOcurrencia ?? null, regulacion ?? null, normativaId ?? null, proveedorId ?? null, probabilidad, severidadId,
           impacto, riesgoInherente, clasificacionId, estado, 1]
        );

        evaluacionCount++;
        if (evaluacionCount % 50 === 0) {
          console.log(`✓ Migrated ${evaluacionCount} evaluaciones...`);
        }
      } catch (err) {
        console.error(`Error migrating row ${i}:`, err.message);
      }
    }

    console.log(`\n✓ Successfully migrated ${evaluacionCount} evaluaciones`);

    // ============================================
    // INSERT REFERENCE DATA
    // ============================================
    console.log('\n=== Inserting Reference Data ===');

    // Insert severity levels if not exist
    const severidades = [
      { letra: 'A', nombre: 'Muy Baja', valor: 1 },
      { letra: 'B', nombre: 'Baja', valor: 2 },
      { letra: 'C', nombre: 'Moderada', valor: 3 },
      { letra: 'D', nombre: 'Alta', valor: 4 },
      { letra: 'E', nombre: 'Crítica', valor: 5 },
    ];

    for (const sev of severidades) {
      try {
        await connection.execute(
          'INSERT INTO severidad (letra, nombre, valor) VALUES (?, ?, ?)',
          [sev.letra, sev.nombre, sev.valor]
        );
        console.log(`✓ Inserted severity: ${sev.letra}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting severity:`, err.message);
        }
      }
    }

    // Insert classifications if not exist
    const clasificaciones = [
      { nombre: 'BAJO', rangoMin: 1, rangoMax: 5, color: 'VERDE' },
      { nombre: 'MEDIO', rangoMin: 6, rangoMax: 10, color: 'AMARILLO' },
      { nombre: 'ALTO', rangoMin: 11, rangoMax: 15, color: 'NARANJA' },
      { nombre: 'CRITICO', rangoMin: 16, rangoMax: 25, color: 'ROJO' },
    ];

    for (const clf of clasificaciones) {
      try {
        await connection.execute(
          'INSERT INTO clasificaciones (nombre, rango_min, rango_max, color) VALUES (?, ?, ?, ?)',
          [clf.nombre, clf.rangoMin, clf.rangoMax, clf.color]
        );
        console.log(`✓ Inserted classification: ${clf.nombre}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting classification:`, err.message);
        }
      }
    }

    // Insert roles if not exist
    const roles = ['SUPER_ADMIN', 'ADMINISTRADOR', 'AUDITOR'];
    for (const role of roles) {
      try {
        await connection.execute(
          'INSERT INTO roles (nombre) VALUES (?)',
          [role]
        );
        console.log(`✓ Inserted role: ${role}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting role:`, err.message);
        }
      }
    }

    console.log('\n✓ Data migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateData();
