import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, normalize } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

if (!existsSync(dist)) throw new Error('dist directory does not exist.');

const htmlFiles = readdirSync(dist).filter((file) => file.endsWith('.html')).sort();
if (htmlFiles.length === 0) throw new Error('No generated HTML pages found.');

const failures: string[] = [];
const localTarget = (raw: string): string | null => {
  const value = raw.trim().split('#')[0].split('?')[0];
  if (!value || value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
    const relative = value.startsWith('/') ? value.slice(1) : value || 'index.html';
    return normalize(relative);
  }
  return null;
};

for (const file of htmlFiles) {
  const html = readFileSync(join(dist, file), 'utf8');
  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing doctype`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) failures.push(`${file}: missing viewport`);
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${file}: missing title`);
  if (!html.includes('site-enhance.js')) failures.push(`${file}: missing site-enhance.js`);
  if (!html.includes('ui-refresh.js')) failures.push(`${file}: missing ui-refresh.js`);
  if (/<script>\s*document\.addEventListener\([\s\S]*?var burger\s*=\s*document\.querySelector\(['"]\.burger/i.test(html)) {
    failures.push(`${file}: legacy inline UI script remains`);
  }

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of refs) {
    const target = localTarget(ref);
    if (!target || ref.startsWith('/')) continue;
    const targetPath = join(dist, target);
    if (!existsSync(targetPath)) failures.push(`${file}: broken local reference ${ref}`);
  }
}

for (const required of ['index.html', 'services.html', 'about.html', 'equipment.html', 'licenses.html', 'contacts.html', 'privacy.html', 'style.css', 'refresh.css', 'site-enhance.js', 'ui-refresh.js']) {
  if (!existsSync(join(dist, required))) failures.push(`missing generated asset ${required}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML pages and their local assets.`);
