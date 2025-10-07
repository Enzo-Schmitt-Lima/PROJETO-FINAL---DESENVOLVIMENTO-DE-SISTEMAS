import fs from 'fs';
import path from 'path';

const oldFileName = 'f01fd795d71bb0cbe54702bf89da2293-kATANA.jpg';
const newFileName = 'de8c3c52a5be1460f04b839d3c5f5e6e-kATANA.jpg';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

const oldFilePath = path.join(tmpDir, oldFileName);
const newFilePath = path.join(tmpDir, newFileName);

fs.rename(oldFilePath, newFilePath, (err) => {
  if (err) {
    console.error('Erro ao renomear arquivo:', err);
  } else {
    console.log(`Arquivo renomeado de ${oldFileName} para ${newFileName}`);
  }
});
