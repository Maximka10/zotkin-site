import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, normalize } from 'node:path';
const root = process.cwd();
const dist = join(root, 'dist');
if (!existsSync(dist)) throw new Error('dist directory does not exist.');
const htmlFiles = readdirSync(dist).filter((file) => file.endsWith('.html')).sort();
if (!htmlFiles.length) throw new Error('No generated HTML pages found.');
const failures: string[] = [];
const localTarget = (raw: string, current: string): string | null => {
  const value = raw.trim().split('#')[0].split('?')[0];
  if (!value || /^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(value)) return null;
  if (value.startsWith('/')) return normalize(value.slice(1));
  if (value.startsWith('./') || value.startsWith('../')) return normalize(join(current, value));
  return normalize(value);
};
for (const file of htmlFiles) {
  const html = readFileSync(join(dist, file), 'utf8');
  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing doctype`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) failures.push(`${file}: missing viewport`);
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${file}: missing title`);
  for (const asset of ['ui-refresh.js', 'site-enhance.js']) if (!html.includes(asset)) failures.push(`${file}: missing ${asset}`);
  if (/<script>\s*document\.addEventListener\([\s\S]*?var burger\s*=\s*document\.querySelector\(['"]\.burger/i.test(html)) failures.push(`${file}: legacy inline UI script remains`);
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const ref of refs) { const target = localTarget(ref, ''); if (!target) continue; if (!existsSync(join(dist, target))) failures.push(`${file}: broken local reference ${ref}`); }
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((m) => m[1]);
  images.forEach((attrs, index) => { if (!/\balt=["']/i.test(attrs)) failures.push(`${file}: image ${index + 1} missing alt`); });
}
for (const required of ['index.html','services.html','about.html','equipment.html','licenses.html','contacts.html','privacy.html','style.css','refresh.css','premium.css','site-enhance.js','ui-refresh.js']) if (!existsSync(join(dist, required))) failures.push(`missing generated asset ${required}`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Verified ${htmlFiles.length} HTML pages, local assets, metadata and image accessibility.`);
