import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inspectHtml } from './security-policy.mjs';
import { finalizeCsp } from './finalize-csp.mjs';

const script = 'document.documentElement.dataset.ready = "yes";';
const hash = createHash('sha256').update(script).digest('base64');
const policy = `default-src 'none'; script-src 'self' 'sha256-${hash}'; script-src-attr 'none'; style-src 'self'; base-uri 'none'; object-src 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'; connect-src 'self'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; media-src 'self'; upgrade-insecure-requests`;
const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
const page = (body, head = meta) => `<!doctype html><html><head>${head}<meta name="referrer" content="no-referrer"></head><body>${body}</body></html>`;

test('accepts approved inline script hashes and local module scripts', () => {
  assert.deepEqual(inspectHtml(page(`<script>${script}</script><script type="module" src="/_astro/app.js"></script>`)), []);
});
test('rejects modified inline script content', () => {
  assert.match(inspectHtml(page(`<script>${script}alert(1)</script>`)).join('\n'), /hash/);
});
test('rejects external scripts and inline event handlers', () => {
  const errors = inspectHtml(page('<script src="https://evil.example/a.js"></script><img src="/a.png" onerror="alert(1)">'));
  assert.match(errors.join('\n'), /external script/);
  assert.match(errors.join('\n'), /event handler/);
});
test('rejects CSP after executable content and absent CSP', () => {
  assert.match(inspectHtml(page('', `<script>${script}</script>${meta}`)).join('\n'), /before/);
  assert.match(inspectHtml(page('', '')).join('\n'), /exactly one CSP/);
});
test('rejects unsafe script sources and JavaScript URLs', () => {
  assert.match(inspectHtml(page('<a href="java&#x73;cript:alert(1)">bad</a>', meta.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"))).join('\n'), /unsafe script|unsafe URL/);
});
test('rejects missing resource constraints and mismatched inline styles', () => {
  assert.match(inspectHtml(page('<style>body{color:red}</style>', meta.replace("object-src 'none';", ''))).join('\n'), /object-src|style hash/);
});
test('finalizes native CSP before scripts while preserving charset and script bytes', () => {
  const html = page(`<script>${script}/* tiếng Việt */</script>`, `<meta charset="utf-8"><script>${script}</script>${meta}`);
  const hardened = finalizeCsp(html);
  assert.deepEqual(inspectHtml(hardened), []);
  assert.ok(hardened.indexOf('charset="utf-8"') < hardened.indexOf('Content-Security-Policy'));
  assert.ok(hardened.includes(`<script>${script}/* tiếng Việt */</script>`));
  assert.equal(finalizeCsp(hardened), hardened);
});
test('finalization fails closed when native CSP is missing', () => {
  assert.throws(() => finalizeCsp(page('<script>alert(1)</script>', '')), /exactly one native CSP/);
});
