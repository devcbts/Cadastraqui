import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const triggersDir = path.join(__dirname, '..', '..', 'prisma', 'triggers');

  if (!fs.existsSync(triggersDir)) {
    throw new Error(`Triggers folder not found: ${triggersDir}`);
  }

  const files = fs
    .readdirSync(triggersDir)
    .filter((f) => f.toLowerCase().endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No .sql files found in triggers directory.');
    return;
  }

  console.log(`Found ${files.length} trigger files.`);

  for (const file of files) {
    const fullPath = path.join(triggersDir, file);
    const sql = fs.readFileSync(fullPath, 'utf8');

    if (!sql || !sql.trim()) {
      console.log(`Skipping empty file: ${file}`);
      continue;
    }

    console.log(`Applying: ${file}`);
    try {
      const statements = splitSqlStatements(sql);
      if (statements.length === 0) {
        console.log(`No executable statements found in: ${file}`);
        continue;
      }

      // Run all statements inside a transaction to keep consistency
      await prisma.$transaction(async (tx) => {
        for (const stmt of statements) {
          await tx.$executeRawUnsafe(stmt);
        }
      });

      console.log(`Applied: ${file}`);
    } catch (err) {
      console.error(`Failed applying ${file}:`, err.message);
      throw err; // stop on first failure to avoid partial setup
    }
  }

  console.log('All triggers applied successfully.');
}

main()
  .catch((err) => {
    console.error('Error applying triggers:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Split SQL file content into executable statements by semicolons, respecting
 * dollar-quoted blocks ($tag$...$tag$), single/double quoted strings, and comments.
 */
function splitSqlStatements(sql) {
  const text = sql.replace(/^[\uFEFF]/, ''); // drop BOM if present

  const statements = [];
  let buf = '';
  let i = 0;

  let inSingle = false;
  let inDouble = false;
  let inLineComment = false; // -- comment
  let inBlockComment = false; // /* */ comment
  let dollarTag = null; // e.g., function body tag

  while (i < text.length) {
    const ch = text[i];
    const next = i + 1 < text.length ? text[i + 1] : '';

    // Handle end of line for line comments
    if (inLineComment) {
      buf += ch;
      if (ch === '\n') {
        inLineComment = false;
      }
      i++;
      continue;
    }

    // Handle end of block comments
    if (inBlockComment) {
      buf += ch;
      if (ch === '*' && next === '/') {
        buf += next;
        i += 2;
        inBlockComment = false;
        continue;
      }
      i++;
      continue;
    }

    // Enter comments when not inside quoted content
    if (!inSingle && !inDouble && !dollarTag) {
      if (ch === '-' && next === '-') {
        buf += ch + next;
        i += 2;
        inLineComment = true;
        continue;
      }
      if (ch === '/' && next === '*') {
        buf += ch + next;
        i += 2;
        inBlockComment = true;
        continue;
      }
    }

    // Dollar-quoted blocks: $tag$ ... $tag$
    if (!inSingle && !inDouble) {
      // Enter dollar-quote
      if (!dollarTag && ch === '$') {
        const tag = readDollarTag(text, i);
        if (tag) {
          dollarTag = tag;
          buf += tag;
          i += tag.length;
          continue;
        }
      }
      // Exit dollar-quote
      if (dollarTag && ch === '$') {
        const tag = readDollarTag(text, i);
        if (tag === dollarTag) {
          buf += tag;
          i += tag.length;
          dollarTag = null;
          continue;
        }
      }
    }

    // Quoted strings handling
    if (!dollarTag) {
      if (!inDouble && ch === "'" && !inSingle) {
        inSingle = true;
      } else if (inSingle && ch === "'") {
        // Handle escaped single quote ''
        if (next === "'") {
          buf += ch + next;
          i += 2;
          continue;
        }
        inSingle = false;
      } else if (!inSingle && ch === '"' && !inDouble) {
        inDouble = true;
      } else if (inDouble && ch === '"') {
        inDouble = false;
      }
    }

    // Statement split on semicolon only when not inside any quoted context
    if (!inSingle && !inDouble && !dollarTag && ch === ';') {
      const stmt = buf.trim();
      if (stmt.length > 0) {
        statements.push(stmt + ';');
      }
      buf = '';
      i++;
      continue;
    }

    // Accumulate
    buf += ch;
    i++;
  }

  const tail = buf.trim();
  if (tail.length > 0) {
    statements.push(tail);
  }

  // Filter out pure comments or whitespace-only statements
  return statements.filter((s) => /\S/.test(s));
}

function readDollarTag(text, startIdx) {
  // Dollar tag: $tag$ or $$
  if (text[startIdx] !== '$') return null;
  let j = startIdx + 1;
  while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j++;
  if (text[j] === '$') {
    return text.slice(startIdx, j + 1);
  }
  return null;
}
