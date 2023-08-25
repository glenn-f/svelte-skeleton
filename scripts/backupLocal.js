import { mkdirSync } from 'fs';
import { db } from '../src/lib/server/db'
import path from 'path';

// Diretório de backup 
const BACKUP_DIRECTORY = 'data/backup';

// Criar o diretório de backup, se não existir
mkdirSync(BACKUP_DIRECTORY, { recursive: true });

// Função para fazer o backup do banco de dados
async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/[.]/g, '');
  const backupFilename = `db-${timestamp}.db`;
  const backupPath = path.join(BACKUP_DIRECTORY, backupFilename);

  await db.backup(backupPath);
  db.close();

  console.log(`Backup concluído: ${backupPath}`);
}

// Realizar o backup
backupDatabase();
