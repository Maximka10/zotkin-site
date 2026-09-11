import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const pagesDir = join(process.cwd(), 'src', 'pages');
const pagesTsDir = join(process.cwd(), 'src', 'pages-ts');

if (!existsSync(pagesDir)) {
  process.exit(0);
}

const htmlFiles = readdirSync(pagesDir)
  .filter((file) => file.endsWith('.html'))
  .sort();

if (htmlFiles.length === 0) {
  process.exit(0);
}

mkdirSync(pagesTsDir, { recursive: true });

const generated: string[] = [];

for (const file of htmlFiles) {
  const sourcePath = join(pagesDir, file);
  const targetPath = join(pagesTsDir, file.replace(/\.html$/i, '.ts'));
  const html = readFileSync(sourcePath, 'utf8');
  const source = `/** Generated from ${file}. Keep the rendered HTML unchanged unless the page itself is intentionally edited. */\nexport const html = ${JSON.stringify(html)};\n`;
  writeFileSync(targetPath, source, 'utf8');
  generated.push(file);
}

// Delete the old HTML sources only after every TypeScript page has been generated.
for (const file of generated) {
  rmSync(join(pagesDir, file));
}

if (readdirSync(pagesDir).length === 0) {
  rmSync(pagesDir, { recursive: true, force: true });
}

console.log(`Migrated ${generated.length} HTML pages to TypeScript.`);
