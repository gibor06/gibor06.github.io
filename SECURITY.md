# Security

Report suspected vulnerabilities privately to **gibor06.dev@gmail.com**. Include the affected URL, impact and a minimal reproduction. Do not publish credentials or personal information in an issue. Do not perform denial-of-service or load testing against the live GitHub Pages site.

This portfolio is a static GitHub Pages website. DDoS mitigation and request throttling are controlled by GitHub, not by browser JavaScript. Custom WAF rules, rate limits and HTTP response headers cannot be configured by this repository for the `github.io` hostname. CSP metadata does not provide `frame-ancestors` or replace server-side clickjacking protection.

Before publishing changes, run:

```sh
npm ci
npm audit --audit-level=high
npm run check
npm run test:security
npm run build
npm run security:verify
npx playwright install chromium
npm run test:security:browser
```

Node.js 24 is used in CI. Keep dependencies and pinned GitHub Actions updated through Dependabot. Only trusted contributors may edit source/MDX or workflows: CSP hashes authorize code present at build time; they do not make malicious repository changes safe.

Maintainers must separately configure passkeys/2FA, recovery codes, least-privilege repository access, secret scanning/push protection where available, and branch protection requiring **Security and production build**. Restrict the `github-pages` deployment environment to `main`. These account/repository settings are not enabled by a local source change.

If a deployment is compromised, revoke affected tokens, review access and workflow changes, restore a known-good commit through a reviewed revert, pass validation and redeploy. Check [GitHub Status](https://www.githubstatus.com/) and contact GitHub Support for platform availability incidents. For hosting quotas, see [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Public certificates, CVs and images can be downloaded and retained by anyone. Review them before publishing; removing a file cannot retract copies already downloaded.
