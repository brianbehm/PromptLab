# PromptLab: Offline Prompt Generator Framework

## Overview
PromptLab is a modular, offline-first prompt generation toolkit built for distributing narrative generation tools. It supports multiple themed generators, local profile saving, and narrative dossier exploration—all running in the browser.

## Key Features
- Load any prompt generator pack (`.json`) from `/packs/`
- Save characters into a persistent local Codex
- View and expand character dossiers over time
- Runs fully offline with no server required

## File Structure
- `home.html`: Start screen for choosing generators or opening Codex
- `index.html`: Main generator engine
- `codex.html`: Character list viewer
- `dossier.html`: Character dossier viewer/editor
- `/packs/`: JSON-based prompt packs
- `/js/`, `/css/`, `/assets/`: Supporting files

## Developer Notes
- Uses `localStorage` for saving and loading character data
- Prompt packs can include prompt structure, dropdowns, and conditional logic
- Future expansion may include IndexedDB, image processing, or drag-and-drop pack loading