# AGENTS Instructions for Codex Agents

Welcome to the **Tembiu** repository. This file provides guidance for automated agents contributing to the project.

## Repository Overview
- `index.html` is the main client page.
- `css/` holds style sheets.
- `js/` contains the core front-end logic. The main script is `js/main.js`.
- `backend/` stores Google Apps Script code used for optional serverless features.
- `docs/` contains documentation for setup and configuration.
- `clones/` contains copies of old branches and must remain untouched.

## Development Guidelines
- Use **4 spaces** for indentation in HTML, CSS and JavaScript files.
- Prefer **double quotes** for strings in JavaScript and HTML attributes.
- Keep code simple and well commented.
- When you modify or add a feature, update `README.md` and `TODO.md` if relevant.

## Testing
- This project currently does **not** include automated tests. If a `package.json` is present, run `npm test` after changes. Otherwise, running `npm test` is expected to fail.

## Local Preview
- To view the app locally, serve the repository with any static file server, e.g.:
  ```bash
  npx serve .
  ```
- Open `http://localhost:3000` (or the port printed by your server tool) in a browser.

## Pull Request Notes
- Summarize notable changes in the PR body under a **Summary** section.
- Include a **Testing** section describing the result of `npm test` or explaining the absence of tests.

