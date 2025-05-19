// Example dossier loaded from localStorage or an API
const dossier = {
  id: 'jebediah_firestorm',
  name: 'Brother Jebediah Firestorm',
  traits: {
    race: 'White',
    ageBracket: 'middle-aged',
    bodyType: 'rotund',
    style: 'a white suit with gold lapels',
    platform: 'Facebook Live',
    era: 'the 1990s prosperity gospel boom',
    energy: 'fiery passion',
    seduction: 'promises financial breakthrough for donors',
    money: 'miracle socks for a love gift',
  },
  media: [],
  history: [
    {
      eventId: 'start',
      prompt:
        'Brother Jebediah Firestorm preaches in a white suit with gold lapels on Facebook Live during the 1990s prosperity gospel boom...',
      timestamp: '2025-05-15T11:30:00Z',
    },
    {
      eventId: 'scandal',
      prompt: 'He was caught streaming from the bathroom, sparking scandal.',
      timestamp: '2025-05-15T11:32:00Z',
    },
  ],
};

// Tree structure (simplified here)
const promptTree = {
  scandal: {
    nextOptions: [
      { label: 'He denies everything.', nextId: 'doublingDown' },
      {
        label: 'He confesses and tries to redeem himself.',
        nextId: 'redemption',
      },
    ],
  },
  redemption: {
    nextOptions: [],
  },
  doublingDown: {
    nextOptions: [],
  },
};

// Populate dossier
let traitBlock;
let promptList;
let imageInput;
let imageContext;
let imageGallery;
let choicesContainer;

function initializeUI() {
  const nameEl = document.getElementById('characterName');
  if (nameEl) nameEl.textContent = dossier.name;

  traitBlock = document.getElementById('characterTraits');
  if (traitBlock) {
    traitBlock.innerHTML =
      `<h2>Traits</h2><ul>` +
      Object.entries(dossier.traits)
        .map(([k, v]) => `<li><strong>${k}</strong>: ${v}</li>`)
        .join('') +
      `</ul>`;
  }

  promptList = document.getElementById('promptTimeline');
  if (promptList) {
    promptList.innerHTML = dossier.history
      .map(
        (h) =>
          `<li><strong>${new Date(h.timestamp).toLocaleString()}</strong>: ${h.prompt}</li>`
      )
      .join('');
  }

  imageInput = document.getElementById('imageInput');
  imageContext = document.getElementById('imageContext');
  imageGallery = document.getElementById('imageGallery');
  choicesContainer = document.getElementById('choicesContainer');

  renderImages();
  renderBranchingOptions();
}

// Images
function handleImageUpload() {
  if (!imageInput || !imageContext) return;
  const file = imageInput.files[0];
  const tag = imageContext.value;

  if (!file || !tag) return alert('Please select a file and add a tag.');

  const reader = new FileReader();
  reader.onload = function (e) {
    dossier.media.push({
      dataUrl: e.target.result,
      context: tag,
    });
    renderImages();
    imageInput.value = '';
    imageContext.value = '';
  };
  reader.readAsDataURL(file);
}

function renderImages() {
  if (!imageGallery) return;
  imageGallery.innerHTML = dossier.media
    .map(
      (img) => `
    <div>
      <img class="preview" src="${img.dataUrl}" />
      <div><em>${img.context}</em></div>
    </div>`
    )
    .join('');
}

// Choices
function renderBranchingOptions() {
  const lastEvent = dossier.history[dossier.history.length - 1];
  const options = (promptTree[lastEvent.eventId] || {}).nextOptions || [];
  const container = choicesContainer;

  if (!container) return;

  if (options.length === 0) {
    container.innerHTML = '<p>No further choices defined for this branch.</p>';
    return;
  }

  container.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt.label;
    btn.onclick = () => alert(`Next node would be: ${opt.nextId}`);
    container.appendChild(btn);
  });
}

// Export in Node and run in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeUI);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeUI };
}
