let output;
let loadStatus;
let errorStatus;
let categoriesContainer;
let generateBtn;
let randomizeBtn;
let copyBtn;

let selects = {};
let categoryObjects = [];
let promptStructure = {};

function initializeUI() {
  output = document.getElementById('output');
  loadStatus = document.getElementById('loadStatus');
  errorStatus = document.getElementById('errorStatus');
  categoriesContainer = document.getElementById('categoriesContainer');
  generateBtn = document.getElementById('generateBtn');
  randomizeBtn = document.getElementById('randomizeBtn');
  copyBtn = document.getElementById('copyBtn');

  const darkmodeToggle = document.getElementById('darkmode');
  if (darkmodeToggle) {
    darkmodeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode', darkmodeToggle.checked);
    });
  }

  const jsonInput = document.getElementById('jsonConfigInput');
  if (jsonInput) {
    jsonInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const config = JSON.parse(ev.target.result);
          loadConfig(config);
        } catch (err) {
          if (errorStatus) errorStatus.textContent = 'Invalid JSON';
          console.error(err);
        }
      };
      reader.readAsText(file);
    });
  }

  if (generateBtn) generateBtn.addEventListener('click', generatePrompt);
  if (randomizeBtn) randomizeBtn.addEventListener('click', randomizeAll);
  if (copyBtn) copyBtn.addEventListener('click', copyPrompt);

  tryLoadConfigFromParam();
}

// Helper to get user pack config from localStorage (shared with home.html)
function getUserPackConfig(id) {
  const packs = JSON.parse(
    localStorage.getItem('user_promptlab_packs') || '[]'
  );
  return packs.find((p) => p.id === id);
}

// Load a config file (used for default_config.json or uploaded files)
async function loadConfig(config) {
  if (!config || !config.categories || !config.promptStructure) {
    if (errorStatus) {
      errorStatus.textContent =
        'Config must include "categories" and "promptStructure".';
    }
    return;
  }
  categoryObjects = config.categories;
  promptStructure = config.promptStructure;

  const titleEl = document.getElementById('mainTitle');
  if (titleEl) titleEl.textContent = config.title || 'Prompt Generator';
  if (typeof document !== 'undefined') {
    document.title = config.pageTitle || config.title || 'Prompt Generator';
  }

  if (categoriesContainer) {
    categoriesContainer.innerHTML = '';
  }
  selects = {};

  categoryObjects.forEach((cat) => {
    const label = document.createElement('label');
    label.textContent = cat.label || cat.id;

    const select = document.createElement('select');
    select.id = cat.id;

    (cat.options || []).forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    if (categoriesContainer) {
      categoriesContainer.appendChild(label);
      categoriesContainer.appendChild(select);
    }
    selects[cat.id] = select;
  });

  generatePrompt();
}

// Basic prompt generation based on placeholders
function generatePrompt() {
  let prompt = promptStructure.base || '';
  Object.entries(selects).forEach(([key, sel]) => {
    const val = sel.value;
    prompt = prompt.replaceAll(`{${key}}`, val || '');
  });
  if (output) {
    output.value = prompt.trim();
  }
}

// Randomize dropdown selections
function randomizeAll() {
  Object.values(selects).forEach((sel) => {
    const len = sel.options.length;
    if (len > 0) sel.selectedIndex = Math.floor(Math.random() * len);
  });
  generatePrompt();
}

// Copy to clipboard
function copyPrompt() {
  if (!output) return;
  navigator.clipboard
    .writeText(output.value)
    .then(() => alert('Copied!'))
    .catch((err) => console.error('Copy failed', err));
}

// Support loading config from URL param (including userpack:)
function getConfigParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('config');
}

async function tryLoadConfigFromParam() {
  const configParam = getConfigParam();
  if (configParam && configParam.startsWith('userpack:')) {
    // Load from localStorage
    const packId = configParam.replace('userpack:', '');
    const config = getUserPackConfig(packId);
    if (config) {
      await loadConfig(config);
      if (loadStatus)
        loadStatus.textContent = `Loaded user pack: ${config.title}`;
      return;
    } else {
      if (errorStatus) errorStatus.textContent = 'User pack not found.';
    }
  } else if (configParam) {
    // Try to fetch from server
    fetch(configParam)
      .then((r) => r.json())
      .then((config) => loadConfig(config))
      .catch(() => {
        if (errorStatus)
          errorStatus.textContent = 'Could not load config from URL.';
      });
    return;
  }
  // Fallback: default config
  fetch('default_config.json')
    .then((r) => r.json())
    .then((config) => loadConfig(config))
    .catch(() => {
      if (loadStatus)
        loadStatus.textContent = 'Drag a config JSON to get started.';
    });
}

// Export in Node and run in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeUI);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeUI };
}
