# Contributing to DrawdownCal

Thank you for taking the time to contribute! 🎉

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/ddcal.git
   cd ddcal
   bun install
   cp .env.example .env
   ```
3. Create a new **branch** (see branch naming below)
4. Make your changes
5. Open a **Pull Request** against `main`

---

## Branch Naming

| Prefix | Use for |
|--------|---------|
| `feat/` | New features (e.g. `feat/recovery-time-chart`) |
| `fix/` | Bug fixes (e.g. `fix/slider-precision`) |
| `docs/` | Documentation-only changes |
| `chore/` | Tooling, CI, dependency updates |
| `refactor/` | Code restructuring without behaviour change |

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short summary>

Examples:
feat(chart): add logarithmic scale toggle
fix(i18n): correct Indonesian translation for equity tab
docs: add deployment guide to README
chore: upgrade Tailwind CSS to v4.3
```

---

## Pull Request Checklist

Before submitting a PR, please confirm:

- [ ] `bun run lint` passes with no new errors
- [ ] `bun run build` completes successfully
- [ ] New features include or update relevant tests (`e2e/`)
- [ ] Public-facing text changes respect bilingual (EN/ID) support — update `src/lib/i18n.tsx`
- [ ] No secrets, API keys, or personal data are included
- [ ] PR description explains *why* the change is needed

---

## Code Style

- **TypeScript** — strict mode, no `any` unless absolutely necessary
- **Prettier** — run `bun run format` before committing
- **Component files** — PascalCase (e.g. `ResultCard.tsx`)
- **Lib/util files** — camelCase (e.g. `drawdown.ts`)

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/alfindigital/ddcal/issues) and include:
- Browser / OS
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots or screen recordings if applicable

---

## Feature Requests

Open an Issue with the `enhancement` label and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered
