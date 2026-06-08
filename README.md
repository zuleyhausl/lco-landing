# Legendary Club Owner — Landing Page

Case study submission for No Surrender Studio.
A landing page introducing Legendary Club Owner (Efsane Başkan) to an English-speaking audience.

## Stack
- Plain HTML / CSS / JS
- Deployed via GitHub Pages

## Structure
- `index.html` — main page
- `styles.css` — styling
- `script.js` — interactive quiz logic
- `/assets` — images (including AI-generated hero visual)

---

## Bonus: Playwright Test Suite

Automated end-to-end tests that verify the interactive elements on the live site.

### What it tests

1. **Page loads correctly** — title, all 6 sections present, hero copy renders
2. **Quiz happy path** — start → 5 questions → valid manager type result → retake works
3. **Hero email form** — submission shows the "You're on the list ✓" confirmation
4. **Signup section form** — same confirmation flow on the dedicated CTA section
5. **Footer links** — all 4 external links point to the correct No Surrender Studio / social URLs and open in a new tab with `rel="noopener"`

### How to run

Requires Node.js 18+ and npm.

```bash
# 1. Install dependencies (one-time)
npm install
npx playwright install chromium

# 2. Run the tests against the live site
npm test

# 3. (Optional) Run with a visible browser window
npm run test:headed

# 4. (Optional) View the HTML report after a run
npm run test:report
```

### Configuration

- Tests target the **live deployment** at `https://zuleyhausl.github.io/lco-landing/` (configured in `playwright.config.js` as `baseURL`)
- Only Chromium is installed to keep things lean — multi-browser support can be enabled by adding more entries to the `projects` array in the config
- Results: pass/fail in the terminal, plus an HTML report in `playwright-report/`
