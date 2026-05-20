/* eslint-disable */
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dbDir = path.join(rootDir, 'database');

// Crear la carpeta database si no existe
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const files = [
    'supabase_complete_lessons_table.sql',
    'supabase_sample_data.sql',
    'supabase_schema.sql',
    'supabase_schema_completo.sql',
    'supabase_schema_v2.sql',
    'supabase_schema_v3_roles.sql',
    'fix_supabase_schema.sql'
];

let movedCount = 0;

files.forEach(file => {
    const oldPath = path.join(rootDir, file);
    const newPath = path.join(dbDir, file);
    
    // Solo mover si el archivo original existe
    if (fs.existsSync(oldPath)) {
        try {
            // Eliminar el archivo de destino si ya existe para evitar errores
            if (fs.existsSync(newPath)) {
                fs.unlinkSync(newPath);
            }
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Movido: ${file} -> database/${file}`);
            movedCount++;
        } catch (error) {
            console.error(`❌ Error al mover ${file}:`, error.message);
        }
    }
});

if (movedCount > 0) {
    console.log(`\n🎉 ¡Listo! ${movedCount} archivos SQL han sido organizados en la carpeta 'database/'.`);
} else {
    console.log('\nNo se encontraron archivos SQL en la raíz para mover (puede que ya estén organizados).');
}
