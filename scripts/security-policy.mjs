import { createHash } from 'node:crypto';
import { parse } from 'parse5';

// Parse as a browser does, including HTML character references in attributes.
export function inspectHtml(html) {
  const nodes = [];
  const visit = (node) => {
    if (node.tagName) nodes.push(node);
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  };
  visit(parse(html, { sourceCodeLocationInfo: true }));
  const attrs = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
  const metas = nodes.filter((n) => n.tagName === 'meta');
  const policies = metas.filter((n) => attrs(n)['http-equiv']?.toLowerCase() === 'content-security-policy');
  const errors = [];
  if (policies.length !== 1) return ['Expected exactly one CSP meta element'];
  const policy = new Map();
  for (const directive of attrs(policies[0]).content.split(';')) {
    const [name, ...values] = directive.trim().split(/\s+/);
    if (!name) continue;
    if (policy.has(name)) errors.push(`Duplicate CSP directive ${name}`);
    policy.set(name, values);
  }
  const required = {
    'default-src': ["'none'"], 'base-uri': ["'none'"], 'object-src': ["'none'"],
    'form-action': ["'none'"], 'frame-src': ["'none'"], 'worker-src': ["'none'"],
    'script-src-attr': ["'none'"], 'connect-src': ["'self'"],
    'img-src': ["'self'", 'data:'], 'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'media-src': ["'self'"], 'upgrade-insecure-requests': [],
  };
  for (const [name, values] of Object.entries(required)) {
    const actual = policy.get(name);
    if (!actual || actual.length !== values.length || values.some((v) => !actual.includes(v))) errors.push(`Invalid ${name}`);
  }
  const scriptSources = policy.get('script-src-elem') ?? policy.get('script-src') ?? [];
  if (!scriptSources.length || scriptSources.some((s) => s !== "'self'" && !/^'sha(256|384|512)-[A-Za-z0-9+/]+=*'$/.test(s))) errors.push('Missing or unsafe script sources');
  const styleSources = policy.get('style-src-elem') ?? policy.get('style-src') ?? [];
  if (!styleSources.length || styleSources.some((s) => !["'self'", 'https://fonts.googleapis.com'].includes(s) && !/^'sha(256|384|512)-[A-Za-z0-9+/]+=*'$/.test(s))) errors.push('Missing or unsafe style sources');
  if (!metas.some((n) => attrs(n).name === 'referrer' && attrs(n).content === 'no-referrer')) errors.push('Missing no-referrer policy');
  const cspOffset = policies[0].sourceCodeLocation.startOffset;
  const textOf = (node) => (node.childNodes ?? []).map((child) => child.value ?? '').join('');
  const matchesHash = (text, sources) => ['sha256', 'sha384', 'sha512'].some((algorithm) => sources.includes(`'${algorithm}-${createHash(algorithm).update(text).digest('base64')}'`));
  for (const node of nodes) {
    const attributes = attrs(node);
    for (const [name, value] of Object.entries(attributes)) {
      if (/^on/i.test(name)) errors.push(`Inline event handler ${name}`);
      if (['href', 'src', 'action', 'formaction', 'xlink:href'].includes(name) && /^(javascript|vbscript):/i.test(value.replace(/[\u0000-\u0020]/g, ''))) errors.push('Found unsafe URL');
      if (name === 'srcdoc') errors.push('Found embedded HTML');
    }
    if (['script', 'style', 'link'].includes(node.tagName) && node.sourceCodeLocation?.startOffset < cspOffset) errors.push('CSP must appear before scripts, styles and links');
    if (node.tagName === 'script') {
      const executable = !attributes.type || ['module', 'text/javascript', 'application/javascript'].includes(attributes.type.toLowerCase());
      if (!executable) continue;
      if (attributes.src) {
        const url = new URL(attributes.src, 'https://gibor06.github.io/');
        if (url.origin !== 'https://gibor06.github.io' || url.protocol !== 'https:') errors.push('Found external script');
      } else if (!matchesHash(textOf(node), scriptSources)) errors.push('Inline script hash is not approved');
    }
    if (node.tagName === 'style' && !matchesHash(textOf(node), styleSources)) errors.push('Inline style hash is not approved');
  }
  return [...new Set(errors)];
}
