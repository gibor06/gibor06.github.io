import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectHtml } from './security-policy.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const errors = [];
let pages = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    const name = relative(root, path);
    if (/^(\.env(?:\.|$)|.*\.(?:pem|pfx|key|map))$/i.test(entry.name)) errors.push(`${name}: forbidden public artifact`);
    if (/\.(?:html|js|mjs|json|txt|svg|xml|css)$/i.test(entry.name)) {
      const text = await readFile(path, 'utf8');
      if (/AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|sk-proj-[A-Za-z0-9_-]{20,}/.test(text)) errors.push(`${name}: possible credential in public output (value redacted)`);
    }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const html = await readFile(path, 'utf8');
    // Astro static redirect stubs contain no executable content or user interface.
    // Require an absolute, explicitly approved redirect instead of pretending they have CSP.
    const redirect = html.match(/http-equiv="refresh" content="0;url=([^"]+)"/i);
    if (redirect) {
      if (redirect[1] !== 'https://github.com/gibor06' || /<script\b/i.test(html)) errors.push(`${name}: unapproved redirect`);
      continue;
    }
    for (const error of inspectHtml(html)) errors.push(`${name}: ${error}`);
  }
}
await stat(root); // Fail closed when the production build does not exist.
await walk(root);
if (pages < 20) errors.push(`Expected the portfolio route set; found only ${pages} HTML pages`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Security policy verified across ${pages} generated HTML pages (including approved redirect stubs).`);
