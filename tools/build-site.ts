import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

type PageModule = { html?: unknown };

const stripLegacyInlineUiScript = (html: string): string => html.replace(
  /\s*<script>\s*document\.addEventListener\([\s\S]*?var burger\s*=\s*document\.querySelector\(['"]\.burger['"]\)[\s\S]*?<\/script>/i,
  ''
);

const injectEnhancementScript = (html: string): string => {
  if (html.includes('site-enhance.js')) return html;
  return html.replace(/<\/body>/i, '  <script src="site-enhance.js" defer></script>\n</body>');
};

const main = async (): Promise<void> => {
  const root = process.cwd();
  const dist = join(root, 'dist');
  const pagesDir = join(root, 'src', 'pages-ts');

  if (!existsSync(pagesDir)) {
    throw new Error('src/pages-ts is missing. The TypeScript page source has not been migrated.');
  }

  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });

  const pageFiles = readdirSync(pagesDir)
    .filter((file) => file.endsWith('.ts'))
    .sort();

  if (pageFiles.length === 0) {
    throw new Error('No TypeScript pages were found.');
  }

  for (const file of pageFiles) {
    const moduleUrl = pathToFileURL(join(pagesDir, file)).href;
    const page = (await import(moduleUrl)) as PageModule;

    if (typeof page.html !== 'string' || !page.html.includes('<!DOCTYPE html>')) {
      throw new Error(`Invalid page module: ${file}`);
    }

    const outputName = file.replace(/\.ts$/i, '.html');
    const normalizedHtml = injectEnhancementScript(stripLegacyInlineUiScript(page.html));
    writeFileSync(join(dist, outputName), normalizedHtml, 'utf8');
  }

  const copyDirectoryContents = (source: string, destination: string): void => {
    if (!existsSync(source)) return;
    mkdirSync(destination, { recursive: true });

    for (const entry of readdirSync(source)) {
      cpSync(join(source, entry), join(destination, entry), { recursive: true });
    }
  };

  copyDirectoryContents(join(root, 'src', 'styles'), dist);
  copyDirectoryContents(join(root, 'src', 'assets', 'images'), dist);
  copyDirectoryContents(join(root, 'src', 'assets', 'icons'), dist);
  copyDirectoryContents(join(root, 'public'), dist);

  const cname = join(root, 'CNAME');
  if (existsSync(cname)) {
    cpSync(cname, join(dist, 'CNAME'));
  }

  console.log(`Generated ${pageFiles.length} static HTML pages from TypeScript.`);
};

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
