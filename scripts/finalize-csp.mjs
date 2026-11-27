import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

// Astro inserts its CSP at the end of authored <head> content and excludes
// is:inline scripts. Move the policy first and hash trusted build-time scripts
// without changing their bytes or granting unsafe-inline to executable code.
export function finalizeCsp(html) {
  const nodes = [];
  const visit = (node) => {
    if (node.tagName) nodes.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(parse(html, { sourceCodeLocationInfo: true }));
  const attrs = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
  const head = nodes.find((node) => node.tagName === 'head');
  const metas = nodes.filter((node) => node.tagName === 'meta' && attrs(node)['http-equiv']?.toLowerCase() === 'content-security-policy');
  if (!metas.length && nodes.some((node) => node.tagName === 'meta' && attrs(node)['http-equiv']?.toLowerCase() === 'refresh')) return html;
  if (metas.length !== 1 || !head?.sourceCodeLocation) throw new Error('Expected exactly one native CSP in an explicit head');
  const meta = metas[0];
  const directives = new Map(attrs(meta).content.split(';').map((value) => value.trim().split(/\s+/)).filter(([name]) => name).map(([name, ...values]) => [name, values]));
  const scriptDirective = directives.has('script-src-elem') ? 'script-src-elem' : 'script-src';
  const scripts = directives.get(scriptDirective);
  if (!scripts) throw new Error('Missing native script-src');
  for (const node of nodes.filter((node) => node.tagName === 'script')) {
    const a = attrs(node);
    if (a.src || (a.type && !['module', 'text/javascript', 'application/javascript'].includes(a.type.toLowerCase()))) continue;
    const text = (node.childNodes ?? []).map((child) => child.value ?? '').join('');
    scripts.push(`'sha256-${createHash('sha256').update(text).digest('base64')}'`);
  }
  const policy = [...directives].map(([name, values]) => [name, ...new Set(values)].join(' ')).join(';');
  const escaped = policy.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const tag = `<meta http-equiv="Content-Security-Policy" content="${escaped}">`;
  const { startOffset, endOffset } = meta.sourceCodeLocation;
  const withoutMeta = html.slice(0, startOffset) + html.slice(endOffset);
  const charset = (head.childNodes ?? []).find((node) => node.tagName === 'meta' && attrs(node).charset);
  const insertion = charset?.sourceCodeLocation?.endOffset ?? head.sourceCodeLocation.startTag.endOffset;
  return withoutMeta.slice(0, insertion) + tag + withoutMeta.slice(insertion);
}

export default function finalizeCspIntegration() {
  return {
    name: 'portfolio-finalize-csp',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        async function walk(directory) {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await walk(path);
            else if (entry.name.endsWith('.html')) await writeFile(path, finalizeCsp(await readFile(path, 'utf8')));
          }
        }
        await walk(fileURLToPath(dir));
      },
    },
  };
}
