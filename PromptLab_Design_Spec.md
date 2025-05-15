# PromptLab Developer Design Spec

## Purpose
This document provides technical guidance for contributors and maintainers of PromptLab, ensuring the system remains modular, maintainable, and easy to extend for new prompt packs, UI features, and integrations (such as Windsurf).

---

## 1. Project Structure & Conventions

- **HTML Entrypoints:**
  - `home.html`: Main launcher/dashboard
  - `index.html`: Prompt generator UI, loads config via `?config=` param
  - `codex.html`: Character browser (localStorage-powered)
  - `dossier.html`: Dossier viewer/editor
- **JS:** Place all logic in `/js/`. Use ES6 modules where possible. Keep UI logic and data logic separated.
- **CSS:** Place all styles in `/css/`. Use BEM or similar methodology for class naming.
- **Data:**
  - `/packs/`: Prompt generator packs (JSON)
  - `/scenes/`: Scene templates (JSON)
  - `/assets/`: Images, icons, etc.

---

## 2. Prompt Pack Format
Each prompt pack JSON should include:
- `title`: Name of the pack
- `categories`: Array of dropdowns (id, label, type, options)
- `promptStructure`: Template string(s) using curly-brace variables matching category IDs

Example:
```json
{
  "title": "Mascot League Generator",
  "categories": [
    { "id": "mascot_type", "label": "Mascot Type", "type": "dropdown", "options": ["gorilla", "cockroach", "squid"] }
  ],
  "promptStructure": {
    "base": "A {mascot_type} prepares for the national mascot showdown...",
    "suffix": "What happens when the whistle blows?"
  }
}
```

---

## 3. Scene Template Format
Each template in `/scenes/scene_templates.json` should include:
- `sceneTemplateId`: Unique string
- `promptStructure`: Object with narrative fragments using curly-brace variables

---

## 4. Local Storage Keys
- `promptlab_dossiers`: Array of character dossiers
- `promptlab_promptTree`: (optional) For branching stories
- `promptlab_sceneTemplates`: (optional) For preloading templates

---

## 5. UI/UX Guidelines
- All pages should work offline (no server dependencies)
- Use semantic HTML and accessible ARIA labels
- Support drag-and-drop JSON loading where possible
- All major actions (save, export, compose) should be available as buttons
- Prefer modular, reusable UI components

---

## 6. Extending the System
- To add a new prompt pack: Drop a JSON file into `/packs/` and link it from `home.html` or via a config param
- To add a new scene template: Add to `/scenes/scene_templates.json`
- To add a new UI page: Add a new HTML file and register it in `home.html`

---

## 7. Coding Standards
- Use ES6+ JavaScript
- Use const/let, arrow functions, and template literals
- Modularize logic (split UI, data, and helpers)
- Comment complex logic and data flows
- Lint with ESLint and format with Prettier (see `.eslintrc.json` and `.prettierrc`)

---

## 8. Testing & Automation
- Use Jest for JS unit testing
- Use Stylelint for CSS
- Run all linters/tests before every commit and push
- GitHub Actions CI runs all checks on push/PR

---

## 9. Contribution Process
- Fork, branch, and PR model
- PRs should pass all checks and include a summary of changes
- Major features should be discussed via GitHub Issues first

---

## 10. Windsurf Integration Notes
- All pages must be embeddable via `<iframe>`
- Support for config param loading (`index.html?config=/packs/my_pack.json`)
- Image references should be supported in prompts and codex exports

---

## 11. Roadmap & TODOs
- [ ] Codex: Add scene prompt composer button
- [ ] Scene templates: UI for preview and copy
- [ ] Pack builder: In-browser CSV → JSON tool
- [ ] Drag-and-drop JSON loader for home.html
- [ ] Visual menu grid for packs (with thumbnails)

---

For questions or design discussions, open an issue or consult the authoring team.
