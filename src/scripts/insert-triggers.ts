import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function insertTriggers() {
  try {
    const triggersPath = join(__dirname, '../../prisma/triggers'); // Caminho para a pasta de triggers
    const triggerFiles = readdirSync(triggersPath).filter(file => file.endsWith('.sql'));

    console.log(`Encontrados ${triggerFiles.length} arquivos de trigger.`);

    for (const file of triggerFiles) {
      const filePath = join(triggersPath, file);
      const sqlContent = readFileSync(filePath, 'utf-8'); // Lê o conteúdo do arquivo SQL

      // Divide os comandos SQL por `;` e remove linhas vazias
      const sqlCommands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      console.log(`Executando ${sqlCommands.length} comandos do arquivo: ${file}`);

      for (const sql of sqlCommands) {
        console.log(`Executando comando: ${sql.slice(0, 50)}...`); // Mostra o início do comando para debug
        await prisma.$executeRawUnsafe(sql); // Executa cada comando individualmente
      }
    }

    console.log('Todos os triggers foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir triggers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa o script
insertTriggers();