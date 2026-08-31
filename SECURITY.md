# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ |

We track the `main` branch. Older tagged releases may not receive security patches.

---

## Scope

DrawdownCal is a **client-side calculator** with no back-end database or user accounts.
The primary attack surfaces are:

- **Dependency vulnerabilities** — third-party npm packages
- **XSS via URL parameters** — drawdown/equity values parsed from query string
- **Supply-chain attacks** — compromised dependencies or CDN scripts

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

To report a security issue, open a [GitHub Security Advisory](https://github.com/alfindigital/ddcal/security/advisories/new) (private disclosure).

Please include:
1. A clear description of the vulnerability
2. Steps to reproduce (PoC code or screenshots)
3. The potential impact
4. Any suggested remediation

We aim to acknowledge reports within **72 hours** and provide a fix or mitigation plan within **14 days** for confirmed issues.

---

## Out of Scope

The following are **not** considered vulnerabilities for this project:

- Issues in dependencies that have no published CVE or fix
- Self-XSS (requires the user to inject their own code)
- Missing security headers that are the responsibility of the hosting platform (Cloudflare)
- Denial of service against free-tier hosting

---

## Responsible Disclosure

We follow coordinated disclosure. If a fix is available, we will publish it before disclosing publicly. We appreciate responsible researchers and will credit you in the release notes (unless you prefer to remain anonymous).
