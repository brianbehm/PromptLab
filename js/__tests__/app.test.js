const { randomizeAll, loadConfig } = require('../../app.js');

describe('randomizeAll', () => {
  beforeEach(() => {
    // Setup minimal DOM elements expected by app.js
    document.body.innerHTML = `
      <span id="loadStatus"></span>
      <span id="errorStatus"></span>
      <textarea id="output"></textarea>
      <div id="categoriesContainer"></div>
      <button id="generateBtn"></button>
      <button id="randomizeBtn"></button>
      <button id="copyBtn"></button>
      <input id="jsonConfigInput" />
      <input id="darkmode" type="checkbox" />
      <h1 id="mainTitle"></h1>
    `;
  });

  it('randomizes each select within its option range', () => {
    const config = {
      categories: [
        { id: 'animal', options: ['Cat', 'Dog', 'Bird'] },
        { id: 'color', options: ['Red', 'Green', 'Blue', 'Yellow'] },
      ],
      promptStructure: { base: '{animal} {color}' },
    };

    loadConfig(config);
    const selects = document.querySelectorAll('#categoriesContainer select');

    randomizeAll();

    selects.forEach(sel => {
      expect(sel.selectedIndex).toBeGreaterThanOrEqual(0);
      expect(sel.selectedIndex).toBeLessThan(sel.options.length);
    });
  });
});
