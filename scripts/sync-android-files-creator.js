const fs = require('fs');
const path = require('path');

const filesToCopy = {
  '../files-build/android/files/MainActivity.java':
    '../apps/creator/android/app/src/main/java/io/bb/pp/cloud/MainActivity.java',
};

Object.entries(filesToCopy).forEach(([source, dest]) => {
  const sourcePath = path.join(__dirname, source);
  const destPath = path.join(__dirname, dest);

  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️ Archivo no encontrado: ${sourcePath}`);
    return;
  }

  // Crear directorio de destino si no existe
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(sourcePath, destPath);
  console.log(`✅ Copiado: ${source} → ${dest}`);
});
