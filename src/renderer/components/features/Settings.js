/**
 * @fileoverview Settings Panel Component
 * 
 * @description
 * Renders the settings panel for configuring timelines,
 * including timezone selection, schedule times, and timeline management.
 * 
 * @module renderer/components/features/Settings
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { TIMEZONES } from '../../../shared/constants/index.js';
import { getCurrentOffset, formatOffset, getTimezonesByOffset } from '../../../shared/utils/timezone.js';
import { store } from '../../store/Store.js';

/**
 * @class SettingsComponent
 * @description
 * Manages the settings panel for timeline configuration.
 * Allows adding, editing, and deleting timelines.
 */
class SettingsComponent {
  /**
   * @private
   * @type {HTMLElement}
   * @description Settings panel element
   */
  #panel = null;

  /**
   * @private
   * @type {HTMLElement}
   * @description Settings content container
   */
  #content = null;

  /**
   * @private
   * @type {Function}
   * @description Callback for when timelines are modified
   */
  #onTimelinesChange = null;

  /**
   * Create a SettingsComponent
   * 
   * @param {HTMLElement} panel - Settings panel element
   * @param {Function} onTimelinesChange - Callback when timelines change
   */
  constructor(panel, onTimelinesChange) {
    this.#panel = panel;
    this.#content = panel.querySelector('#settingsContent');
    this.#onTimelinesChange = onTimelinesChange;
    this.#setupEventListeners();
  }

  /**
   * Setup event listeners
   * 
   * @private
   */
  #setupEventListeners() {
    // Add timeline button
    const addBtn = this.#panel.querySelector('#addTimelineBtn');
    addBtn?.addEventListener('click', () => this.addTimeline());
  }

  /**
   * Open the settings panel
   */
  open() {
    this.#panel.classList.add('open');
  }

  /**
   * Close the settings panel
   */
  close() {
    this.#panel.classList.remove('open');
  }

  /**
   * Render settings for all timelines
   */
  render() {
    const config = store.get('config');
    if (!config || !this.#content) return;

    this.#content.innerHTML = '';

    config.timelines.forEach(timeline => {
      const card = this.#createTimelineSettingCard(timeline);
      this.#content.appendChild(card);
    });
  }

  /**
   * Create a timeline setting card
   * 
   * @private
   * @param {Object} timeline - Timeline configuration
   * @returns {HTMLElement} Timeline setting card element
   */
  #createTimelineSettingCard(timeline) {
    const card = document.createElement('div');
    card.className = 'timeline-setting';
    card.dataset.id = timeline.id;

    const currentOffset = getCurrentOffset(timeline.timezone);

    card.innerHTML = `
      <div class="timeline-setting-header">
        <input type="text" class="name-input" value="${timeline.name}" placeholder="Name">
        <button class="delete-timeline-btn" data-id="${timeline.id}">Delete</button>
      </div>
      <div class="setting-row timezone-row">
        <span class="setting-label">GMT Offset</span>
        <input type="number" class="gmt-offset-input" value="${currentOffset}" step="0.5" min="-12" max="14" placeholder="e.g. 10">
        <button class="filter-btn" title="Filter by this offset">Filter</button>
        <button class="clear-filter-btn" title="Show all timezones">All</button>
      </div>
      <div class="setting-row">
        <span class="setting-label">Timezone</span>
        <select class="timezone-select"></select>
      </div>
      <div class="time-inputs">
        <div class="time-input-group">
          <label>Wake Time</label>
          <input type="time" class="wake-input" value="${timeline.wakeTime}">
        </div>
        <div class="time-input-group">
          <label>Sleep Time</label>
          <input type="time" class="sleep-input" value="${timeline.sleepTime}">
        </div>
        <div class="time-input-group">
          <label>Work Start</label>
          <input type="time" class="work-start-input" value="${timeline.workStart}">
        </div>
        <div class="time-input-group">
          <label>Work End</label>
          <input type="time" class="work-end-input" value="${timeline.workEnd}">
        </div>
      </div>
    `;

    const selectEl = card.querySelector('.timezone-select');
    const gmtInput = card.querySelector('.gmt-offset-input');
    const filterBtn = card.querySelector('.filter-btn');
    const clearFilterBtn = card.querySelector('.clear-filter-btn');

    // Initial population
    this.#populateTimezoneDropdown(selectEl, timeline.timezone);

    // Filter button
    filterBtn.addEventListener('click', () => {
      const offset = gmtInput.value;
      this.#populateTimezoneDropdown(selectEl, timeline.timezone, offset);
    });

    // Clear filter button
    clearFilterBtn.addEventListener('click', () => {
      gmtInput.value = '';
      this.#populateTimezoneDropdown(selectEl, timeline.timezone);
    });

    // Update GMT offset when timezone changes
    selectEl.addEventListener('change', () => {
      const newOffset = getCurrentOffset(selectEl.value);
      gmtInput.value = newOffset;
      this.#saveTimelineSettings(card, timeline.id);
    });

    // Save on input changes
    const inputs = card.querySelectorAll('.name-input, .wake-input, .sleep-input, .work-start-input, .work-end-input');
    inputs.forEach(input => {
      input.addEventListener('change', () => this.#saveTimelineSettings(card, timeline.id));
    });

    // Delete button
    card.querySelector('.delete-timeline-btn').addEventListener('click', () => {
      this.deleteTimeline(timeline.id);
    });

    return card;
  }

  /**
   * Populate timezone dropdown
   * 
   * @private
   * @param {HTMLSelectElement} selectEl - Select element
   * @param {string} selectedValue - Currently selected timezone
   * @param {number|null} filterOffset - GMT offset to filter by
   */
  #populateTimezoneDropdown(selectEl, selectedValue, filterOffset = null) {
    const timezones = getTimezonesByOffset(filterOffset);
    selectEl.innerHTML = '';

    timezones.forEach(tz => {
      const offset = getCurrentOffset(tz.value);
      const offsetStr = formatOffset(offset);
      const option = document.createElement('option');
      option.value = tz.value;
      option.textContent = `${tz.label} (${offsetStr})`;
      option.selected = tz.value === selectedValue;
      selectEl.appendChild(option);
    });
  }

  /**
   * Save timeline settings from a card
   * 
   * @private
   * @param {HTMLElement} card - Timeline setting card
   * @param {string} id - Timeline ID
   */
  async #saveTimelineSettings(card, id) {
    const config = store.get('config');
    const timeline = config.timelines.find(t => t.id === id);
    if (!timeline) return;

    timeline.name = card.querySelector('.name-input').value;
    timeline.timezone = card.querySelector('.timezone-select').value;
    timeline.wakeTime = card.querySelector('.wake-input').value;
    timeline.sleepTime = card.querySelector('.sleep-input').value;
    timeline.workStart = card.querySelector('.work-start-input').value;
    timeline.workEnd = card.querySelector('.work-end-input').value;

    store.set('config', config);
    await window.electronAPI.saveConfig(config);
    
    if (this.#onTimelinesChange) {
      this.#onTimelinesChange();
    }
  }

  /**
   * Delete a timeline
   * 
   * @param {string} id - Timeline ID to delete
   */
  async deleteTimeline(id) {
    const config = store.get('config');
    
    if (config.timelines.length <= 1) {
      alert('You must have at least one timeline.');
      return;
    }

    config.timelines = config.timelines.filter(t => t.id !== id);
    store.set('config', config);
    await window.electronAPI.saveConfig(config);
    
    this.render();
    if (this.#onTimelinesChange) {
      this.#onTimelinesChange();
    }
  }

  /**
   * Add a new timeline
   */
  async addTimeline() {
    const config = store.get('config');
    const newId = Date.now().toString();
    
    config.timelines.push({
      id: newId,
      name: 'New Person',
      timezone: 'America/New_York',
      wakeTime: '07:00',
      sleepTime: '23:00',
      workStart: '09:00',
      workEnd: '17:00'
    });

    store.set('config', config);
    await window.electronAPI.saveConfig(config);
    
    this.render();
    if (this.#onTimelinesChange) {
      this.#onTimelinesChange();
    }
  }
}

export { SettingsComponent };
export default SettingsComponent;
