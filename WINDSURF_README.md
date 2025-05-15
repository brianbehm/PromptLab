# PromptLab Integration Guide for Windsurf

## 📦 Overview

This folder contains a complete, modular, offline-first system for character prompt generation, narrative scene composition, and dossier-based storytelling.

The system is designed to run inside Windsurf as a local HTML/JS-based toolkit. All packs, templates, and data are self-contained. No server or backend is required.

---

## 🧱 Directory Structure

PromptLab/
├── home.html                ← Main launcher
├── index.html               ← Prompt generator (JSON-driven)
├── codex.html               ← Saved characters browser
├── dossier.html             ← Character dossier viewer/editor
├── js/                      ← Core logic (prompt engine, codex)
├── css/                     ← Shared and page-specific styles
├── packs/                   ← Prompt generator JSON packs
├── scenes/                  ← Cinematic prompt templates
├── assets/                  ← (Optional) logos, thumbnails

---

## 🧭 System Workflow

### 1. Prompt Packs (`/packs/`)
- JSON files defining category dropdowns and prompt structure
- Users can create new packs using the in-browser `builder.html` tool (coming soon)
- Files must follow the `default_config.json` format (see below)

### 2. Codex System (`codex.html`, `dossier.html`)
- Characters generated via the prompt engine can be saved to localStorage
- Each codex entry includes traits, an ID, optional image references, and a prompt history
- Users can attach images and labels (e.g., for Midjourney, Sora)

### 3. Scene Composer (`/scenes/scene_templates.json`)
- Templates define cinematic prompt structures based on codex traits
- Each includes trait mappings, visual fragments, and image reference placeholders
- Can be called via dropdown or button from codex entries

---

## 🧰 Prompt Pack JSON Format

```json
{
  "title": "Mascot League Generator",
  "categories": [
    {
      "id": "mascot_type",
      "label": "Mascot Type",
      "type": "dropdown",
      "options": ["gorilla", "cockroach", "squid"]
    }
  ],
  "promptStructure": {
    "base": "A {mascot_type} prepares for the national mascot showdown...",
    "suffix": "What happens when the whistle blows?"
  }
}
```

⸻

🎬 Scene Template Format (Cinematic Prompts)

Stored in /scenes/scene_templates.json

{
  "sceneTemplateId": "vault_escape_heist",
  "promptStructure": {
    "visual_intro": "In a {location}, {code_name} — a {signature_look} {specialty} — is caught mid-action.",
    "action_beat": "They're {dynamic_action}, while {threat_or_twist}.",
    "visual_detail": "Reflections of {visual_effect} flicker in their {accessory_or_trait}.",
    "image_prefix": "Image reference: {image_url}\n\n"
  },
  ...
}

⸻

🔧 Local Storage Keys

| Key                   | Description                          |
|-----------------------|--------------------------------------|
| promptlab_dossiers    | Array of saved character profiles     |
| promptlab_promptTree  | Optional for branching narratives     |
| promptlab_sceneTemplates | Optional preload for scene templates |

⸻

🧠 Implementation Notes for Windsurf
- All UIs run standalone with no dependencies — can be embedded via <iframe> or loaded as standalone routes
- To support adding new packs dynamically, index.html should check ?config=/packs/filename.json
- Codex entries may include image references. These should display in any Sora/MJ-ready prompt export.

⸻

✅ Suggested Next Integration Tasks
1. Load scene_templates.json into a dropdown in codex.html
2. Create a “Compose Scene Prompt” button per dossier
3. Allow copy of full MJ-ready prompt with image_url + cinematic narrative

⸻

📤 Optional Enhancements
- CSV → JSON pack builder tool
- Category entry weighting for generator tuning
- Drag-and-drop .json loader in home.html
- Pack thumbnail & description metadata for visual menu grid

⸻

✉️ Questions?

This package is designed to be developer-friendly, extensible, and cleanly integrated into narrative tools like Windsurf. For further modularization help or UI adaptations, consult the authoring team or reference PromptLab_Design_Spec.md (if provided).
