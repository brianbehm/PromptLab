const output = document.getElementById('output');
const loadStatus = document.getElementById('loadStatus');
const errorStatus = document.getElementById('errorStatus');
const categoriesContainer = document.getElementById('categoriesContainer');
const generateBtn = document.getElementById('generateBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const copyBtn = document.getElementById('copyBtn');

let selects = {};
let categoryObjects = [];
let promptStructure = {};

function toggleTheme() {
  const toggle = document.getElementById('darkmode');
  if (!toggle) return;
  document.body.classList.toggle('dark-mode', toggle.checked);
}

document.getElementById('darkmode').addEventListener('change', toggleTheme);

document.getElementById('jsonConfigInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const config = JSON.parse(e.target.result);
      loadConfig(config);
    } catch (err) {
      errorStatus.textContent = 'Invalid JSON';
      console.error(err);
    }
  };
  reader.readAsText(file);
});

generateBtn.addEventListener('click', generatePrompt);
randomizeBtn.addEventListener('click', randomizeAll);
copyBtn.addEventListener('click', copyPrompt);

// Helper to get user pack config from localStorage (shared with home.html)
function getUserPackConfig(id) {
  const packs = JSON.parse(localStorage.getItem('user_promptlab_packs') || '[]');
  return packs.find(p => p.id === id);
}

// Load a config file (used for default_config.json or uploaded files)
async function loadConfig(config) {
  if (!config || !config.categories || !config.promptStructure) {
    errorStatus.textContent = 'Config must include "categories" and "promptStructure".';
    return;
  }
  categoryObjects = config.categories;
  promptStructure = config.promptStructure;

  document.getElementById('mainTitle').textContent = config.title || 'Prompt Generator';
  document.title = config.pageTitle || config.title || 'Prompt Generator';

  categoriesContainer.innerHTML = '';
  selects = {};

  categoryObjects.forEach(cat => {
    const label = document.createElement('label');
    label.textContent = cat.label || cat.id;

    const select = document.createElement('select');
    select.id = cat.id;

    (cat.options || []).forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    categoriesContainer.appendChild(label);
    categoriesContainer.appendChild(select);
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
  output.value = prompt.trim();
}

// Randomize dropdown selections
function randomizeAll() {
  Object.values(selects).forEach(sel => {
    const len = sel.options.length;
    if (len > 0) sel.selectedIndex = Math.floor(Math.random() * len);
  });
  generatePrompt();
}

// Copy to clipboard
function copyPrompt() {
  navigator.clipboard.writeText(output.value)
    .then(() => alert('Copied!'))
    .catch(err => console.error('Copy failed', err));
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
      loadStatus.textContent = `Loaded user pack: ${config.title}`;
      return;
    } else {
      errorStatus.textContent = 'User pack not found.';
    }
  } else if (configParam) {
    // Try to fetch from server
    fetch(configParam)
      .then(r => r.json())
      .then(config => loadConfig(config))
      .catch(() => {
        errorStatus.textContent = 'Could not load config from URL.';
      });
    return;
  }
  // Fallback: default config
  fetch('default_config.json')
    .then(r => r.json())
    .then(config => loadConfig(config))
    .catch(() => {
      loadStatus.textContent = 'Drag a config JSON to get started.';
    });
}

// Export functions for testing or initialize when running in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { randomizeAll, loadConfig };
} else {
  // Initial load
  tryLoadConfigFromParam();
}
