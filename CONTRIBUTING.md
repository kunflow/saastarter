# Contributing to Next-AI SaaS Starter

First off, **thank you** for considering contributing to Next-AI SaaS Starter! 🎉

Every contribution matters — whether it's fixing a typo, reporting a bug, or building a new feature.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)

## Code of Conduct

This project follows a standard code of conduct. By participating, you are expected to uphold a welcoming, inclusive, and respectful environment for everyone.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/saastarter.git
   cd saastarter
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/kunflow/saastarter.git
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase account (free tier works)

### Install & Run

```bash
pnpm install
cp .env.example .env
# Edit .env with your Supabase credentials
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## How to Contribute

### 🐛 Reporting Bugs

- Use the [Bug Report template](https://github.com/kunflow/saastarter/issues/new?template=bug_report.md)
- Include steps to reproduce, expected vs actual behavior
- Add screenshots if applicable
- Include your environment details

### ✨ Suggesting Features

- Use the [Feature Request template](https://github.com/kunflow/saastarter/issues/new?template=feature_request.md)
- Describe the use case and who would benefit
- Check existing issues first to avoid duplicates

### 🔧 Submitting Code

1. Make sure there's an issue for what you're working on (create one if needed)
2. Keep PRs focused — one feature or fix per PR
3. Write/update tests if applicable
4. Update documentation if you're changing behavior
5. Follow the coding standards below

## Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes** thoroughly:
   ```bash
   pnpm build    # Ensure it builds
   pnpm lint     # Check for lint errors
   ```

3. **Push** your branch and create a PR:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Fill out the PR template** with:
   - What changed and why
   - Link to the related issue
   - Screenshots for UI changes

5. **Wait for review** — maintainers will review your PR and may request changes

## Coding Standards

- **TypeScript** — Use proper types, avoid `any`
- **Components** — Functional components with hooks
- **Styling** — Tailwind CSS utility classes, avoid custom CSS
- **File naming** — kebab-case for files, PascalCase for components
- **Imports** — Use path aliases (`@/components/...`)

### Project Structure

```
src/
├── app/          # Pages and API routes
├── components/   # Reusable React components
├── config/       # Configuration files
└── lib/          # Utility functions and clients
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process or tooling changes |

### Examples

```
feat(auth): add Google OAuth provider
fix(credits): correct balance calculation on refund
docs(readme): update quick start instructions
```

---

## 💬 Questions?

If you have questions about contributing, feel free to:

- Open a [Discussion](https://github.com/kunflow/saastarter/discussions)
- Open an [Issue](https://github.com/kunflow/saastarter/issues)

Thank you for helping make Next-AI SaaS Starter better! 🚀
