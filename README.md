# DrawdownCal

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with TanStack Start](https://img.shields.io/badge/TanStack_Start-v1-orange)](https://tanstack.com/start)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)](https://tailwindcss.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020)](https://workers.cloudflare.com)

**DrawdownCal** is a free, installable web calculator that tells traders exactly how much profit they need to recover from a drawdown. No sign-up. No ads. Works offline as a PWA.

---

## Features

- 📉 **Two input modes** — enter drawdown as a percentage *or* as actual equity values (initial vs current)
- 🔢 **Instant recovery formula** — displays the required recovery % with animated precision
- 📊 **Interactive drawdown chart** — click any point to set the drawdown level
- 🔁 **Scenario comparison** — add multiple drawdown scenarios side-by-side
- 🕐 **Recovery time estimator** — estimate months to break even given a target monthly return
- 🔗 **Shareable URLs** — every calculator state is encoded in the URL for easy sharing
- 🖼️ **Share card** — download or share a branded result image (via `html-to-image`)
- 🌗 **Dark / light theme** — persisted to `localStorage`, no flash of unstyled content
- 📱 **PWA / installable** — works offline, add-to-home-screen on mobile
- ♿ **Accessible** — respects `prefers-reduced-motion`, keyboard-navigable
- 🌐 **Bilingual (EN / ID)** — i18n built in, language toggles in the header

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.1 (or Node.js ≥ 20 + npm)
- Git

### Clone & install

```bash
git clone https://github.com/alfindigital/ddcal.git
cd ddcal
bun install        # or: npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env — set VITE_SITE_URL to your deployment URL
```

### Develop

```bash
bun run dev        # starts Vite dev server at http://localhost:3000
```

### Build

```bash
bun run build      # production build → dist/
bun run preview    # preview the production build locally
```

### Lint & format

```bash
bun run lint       # ESLint
bun run format     # Prettier
```

---

## Project Structure

```
ddcal/
├── src/
│   ├── components/       # UI components (Calculator, Chart, Footer, Header…)
│   │   └── ui/           # Radix-powered shadcn/ui primitives
│   ├── hooks/            # Custom React hooks
│   ├── lib/
│   │   ├── analytics.ts  # Optional GA4 wrapper (no-ops when VITE_GA_ID unset)
│   │   ├── drawdown.ts   # Core drawdown / recovery math
│   │   ├── i18n.tsx      # EN / ID translations
│   │   ├── jsonld.ts     # Structured data helpers
│   │   ├── pwa-register.ts
│   │   └── seo.ts        # Canonical URL + meta-tag helpers
│   ├── routes/           # TanStack Router file-based routes
│   │   ├── __root.tsx    # Shell, head tags, PWA bootstrap
│   │   ├── index.tsx     # Home page (main calculator)
│   │   ├── about.tsx     # About / FAQ page
│   │   └── drawdown/     # Dynamic landing pages per drawdown %
│   ├── router.tsx        # Router instance
│   └── styles.css        # Global Tailwind v4 styles
├── public/               # Static assets (favicon, OG image, manifest…)
├── e2e/                  # Playwright end-to-end tests
├── scripts/              # Pre-build content-check scripts
├── .env.example          # ← copy to .env and fill in values
├── vite.config.ts
├── wrangler.jsonc        # Cloudflare Workers deploy config
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI primitives | [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Build tool | [Vite 7](https://vite.dev) |
| Runtime / deploy | [Cloudflare Workers](https://workers.cloudflare.com) via `@cloudflare/vite-plugin` |
| Testing | [Playwright](https://playwright.dev) (e2e) |
| Package manager | [Bun](https://bun.sh) |

---

## Optional Configuration

| Variable | Required | Description |
|---|---|---|
| `VITE_SITE_URL` | Recommended | Full public URL of your deployment (e.g. `https://ddcal.example.com`) |
| `VITE_GA_ID` | No | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). Omit to disable analytics entirely. |

---

## Deploying to Cloudflare Workers

```bash
bun run build
bunx wrangler deploy     # or: npx wrangler deploy
```

Configure `wrangler.jsonc` with your Cloudflare account details before deploying.

---

## Contributing

Contributions, bug reports, and feature requests are welcome!
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Security

Please see [SECURITY.md](SECURITY.md) for our responsible disclosure policy.

---

## License

[MIT](LICENSE) © 2026 DrawdownCal contributors
