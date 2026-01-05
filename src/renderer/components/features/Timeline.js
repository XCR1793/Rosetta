/**
 * @fileoverview Timeline Component
 * 
 * @description
 * Renders timeline rows showing time, schedule blocks (sleep/awake/work),
 * hour labels, and current time indicators. All elements are generated
 * in a single unified pass for consistent positioning.
 * 
 * @module renderer/components/features/Timeline
 * @category renderer
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

import { TIMEZONES, SYNC_LINE_POSITION, MINUTES_PER_DAY, MINUTES_PER_48_HOURS } from '../../../shared/constants/index.js';
import { getCurrentOffset, formatOffset, getTimeInTimezone, timeToMinutes, formatTime, formatDate } from '../../../shared/utils/timezone.js';
import { store } from '../../store/Store.js';

/**
 * @class TimelineComponent
 * @description
 * Manages rendering and updating of timeline rows.
 * Each timeline shows a person's schedule in their timezone.
 */
class TimelineComponent {
  /**
   * @private
   * @type {HTMLElement}
   * @description Container element for timelines
   */
  #container = null;

  /**
   * Create a TimelineComponent
   * 
   * @param {HTMLElement} container - Container element for timeline rows
   */
  constructor(container) {
    this.#container = container;
  }

  /**
   * Render all timeline rows
   * 
   * @param {Array<Object>} timelines - Array of timeline configuration objects
   */
  render(timelines) {
    this.#container.innerHTML = '';

    timelines.forEach(timeline => {
      const row = this.#createTimelineRow(timeline);
      this.#container.appendChild(row);
    });

    // Add legend
    this.#container.appendChild(this.#createLegend());
  }

  /**
   * Create a timeline row element
   * 
   * @private
   * @param {Object} timeline - Timeline configuration
   * @returns {HTMLElement} Timeline row element
   */
  #createTimelineRow(timeline) {
    const row = document.createElement('div');
    row.className = 'timeline-row';
    row.dataset.id = timeline.id;

    const offset = getCurrentOffset(timeline.timezone);
    const offsetStr = formatOffset(offset);

    row.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-name">${timeline.name} <span style="color: #666; font-size: 11px;">(${offsetStr})</span></span>
        <div>
          <span class="timeline-time" data-tz="${timeline.timezone}">--:--:--</span>
          <span class="timeline-date" data-tz-date="${timeline.timezone}"></span>
        </div>
      </div>
      <div class="timeline-bar-container" data-timezone="${timeline.timezone}">
        <div class="timeline-bar" data-timeline-id="${timeline.id}" data-timezone="${timeline.timezone}"></div>
        <div class="hour-labels" data-timezone="${timeline.timezone}"></div>
      </div>
    `;

    // Build complete timeline in one pass
    this.#buildTimeline(row, timeline);

    return row;
  }

  /**
   * Build complete timeline with schedule blocks, current time indicator, and hour labels
   * All elements are positioned relative to the same 48-hour coordinate system
   * 
   * @private
   * @param {HTMLElement} row - Timeline row element
   * @param {Object} timeline - Timeline configuration
   */
  #buildTimeline(row, timeline) {
    const bar = row.querySelector('.timeline-bar');
    const labelsContainer = row.querySelector('.hour-labels');
    
    bar.innerHTML = '';
    labelsContainer.innerHTML = '';

    // Parse schedule times
    const wakeMinutes = timeToMinutes(timeline.wakeTime);
    const sleepMinutes = timeToMinutes(timeline.sleepTime);
    const workStartMinutes = timeToMinutes(timeline.workStart);
    const workEndMinutes = timeToMinutes(timeline.workEnd);

    // Get current time in this timezone
    const currentTime = getTimeInTimezone(timeline.timezone);
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Generate and render schedule segments
    const segments = this.#generateScheduleSegments(
      wakeMinutes, sleepMinutes, workStartMinutes, workEndMinutes
    );

    segments.forEach(seg => {
      if (seg.start < seg.end) {
        const block = document.createElement('div');
        block.className = `schedule-block ${seg.type}`;
        block.style.left = `${(seg.start / MINUTES_PER_48_HOURS) * 100}%`;
        block.style.width = `${((seg.end - seg.start) / MINUTES_PER_48_HOURS) * 100}%`;
        bar.appendChild(block);
      }
    });

    // Add current time indicator
    const indicator = document.createElement('div');
    indicator.className = 'current-time-indicator';
    indicator.dataset.tz = timeline.timezone;
    indicator.style.left = `${(currentMinutes / MINUTES_PER_48_HOURS) * 100}%`;
    bar.appendChild(indicator);

    // Generate hour labels
    const use24Hour = store.get('use24Hour');
    for (let h = 0; h < 48; h += 3) {
      const label = document.createElement('span');
      label.className = 'hour-label';
      const hour = h % 24;
      
      if (use24Hour) {
        label.textContent = `${hour.toString().padStart(2, '0')}`;
      } else {
        if (hour === 0) {
          label.textContent = '12a';
        } else if (hour === 12) {
          label.textContent = '12p';
        } else if (hour < 12) {
          label.textContent = `${hour}a`;
        } else {
          label.textContent = `${hour - 12}p`;
        }
      }
      
      label.style.position = 'absolute';
      label.style.left = `${(h / 48) * 100}%`;
      label.style.transform = 'translateX(-50%)';
      labelsContainer.appendChild(label);
    }
  }

  /**
   * Generate schedule segments for a 48-hour period
   * 
   * @private
   * @param {number} wakeMinutes - Wake time in minutes
   * @param {number} sleepMinutes - Sleep time in minutes
   * @param {number} workStartMinutes - Work start in minutes
   * @param {number} workEndMinutes - Work end in minutes
   * @returns {Array<Object>} Array of segment objects
   */
  #generateScheduleSegments(wakeMinutes, sleepMinutes, workStartMinutes, workEndMinutes) {
    const segments = [];
    const sleepCrossesMidnight = sleepMinutes < wakeMinutes;
    const workCrossesMidnight = workEndMinutes < workStartMinutes;

    const addDaySegments = (dayOffset) => {
      const base = dayOffset * MINUTES_PER_DAY;
      
      if (sleepCrossesMidnight) {
        segments.push({ start: base, end: base + wakeMinutes, type: 'sleep' });
        
        if (workCrossesMidnight) {
          segments.push({ start: base + wakeMinutes, end: base + workStartMinutes, type: 'awake' });
          segments.push({ start: base + workStartMinutes, end: base + MINUTES_PER_DAY, type: 'work' });
        } else {
          segments.push({ start: base + wakeMinutes, end: base + workStartMinutes, type: 'awake' });
          segments.push({ start: base + workStartMinutes, end: base + workEndMinutes, type: 'work' });
          segments.push({ start: base + workEndMinutes, end: base + MINUTES_PER_DAY, type: 'awake' });
        }
      } else {
        segments.push({ start: base, end: base + wakeMinutes, type: 'sleep' });
        
        if (workCrossesMidnight) {
          segments.push({ start: base + wakeMinutes, end: base + workStartMinutes, type: 'awake' });
          segments.push({ start: base + workStartMinutes, end: base + MINUTES_PER_DAY, type: 'work' });
        } else {
          segments.push({ start: base + wakeMinutes, end: base + workStartMinutes, type: 'awake' });
          segments.push({ start: base + workStartMinutes, end: base + workEndMinutes, type: 'work' });
          segments.push({ start: base + workEndMinutes, end: base + sleepMinutes, type: 'awake' });
          segments.push({ start: base + sleepMinutes, end: base + MINUTES_PER_DAY, type: 'sleep' });
        }
      }
    };

    addDaySegments(0);
    addDaySegments(1);

    if (workCrossesMidnight) {
      segments.push({ start: 0, end: workEndMinutes, type: 'work' });
      segments.push({ start: MINUTES_PER_DAY, end: MINUTES_PER_DAY + workEndMinutes, type: 'work' });
      
      if (sleepCrossesMidnight) {
        segments.push({ start: workEndMinutes, end: sleepMinutes, type: 'awake' });
        segments.push({ start: MINUTES_PER_DAY + workEndMinutes, end: MINUTES_PER_DAY + sleepMinutes, type: 'awake' });
      }
    }

    return this.#mergeSegments(segments);
  }

  /**
   * Merge overlapping segments, prioritizing work > awake > sleep
   * 
   * @private
   * @param {Array<Object>} segments - Raw segments
   * @returns {Array<Object>} Merged segments
   */
  #mergeSegments(segments) {
    if (segments.length === 0) return [];

    const priority = { work: 3, awake: 2, sleep: 1 };
    const minuteMap = new Array(MINUTES_PER_48_HOURS).fill(null);
    
    segments.forEach(seg => {
      for (let m = seg.start; m < seg.end && m < MINUTES_PER_48_HOURS; m++) {
        if (minuteMap[m] === null || priority[seg.type] > priority[minuteMap[m]]) {
          minuteMap[m] = seg.type;
        }
      }
    });

    const result = [];
    let currentSeg = null;

    for (let m = 0; m < MINUTES_PER_48_HOURS; m++) {
      const type = minuteMap[m] || 'sleep';
      
      if (!currentSeg || currentSeg.type !== type) {
        if (currentSeg) {
          currentSeg.end = m;
          result.push(currentSeg);
        }
        currentSeg = { start: m, end: m + 1, type };
      }
    }
    
    if (currentSeg) {
      currentSeg.end = MINUTES_PER_48_HOURS;
      result.push(currentSeg);
    }

    return result;
  }

  /**
   * Create the legend element
   * 
   * @private
   * @returns {HTMLElement} Legend element
   */
  #createLegend() {
    const legend = document.createElement('div');
    legend.className = 'legend';
    legend.innerHTML = `
      <div class="legend-item">
        <div class="legend-color sleep"></div>
        <span>Sleeping</span>
      </div>
      <div class="legend-item">
        <div class="legend-color awake"></div>
        <span>Awake</span>
      </div>
      <div class="legend-item">
        <div class="legend-color work"></div>
        <span>Working</span>
      </div>
    `;
    return legend;
  }

  /**
   * Sync timeline positions based on current time
   */
  syncTimelines() {
    const syncMode = store.get('syncMode');

    // Process each timeline row to ensure consistent handling
    document.querySelectorAll('.timeline-row').forEach(row => {
      const bar = row.querySelector('.timeline-bar');
      const labels = row.querySelector('.hour-labels');
      
      if (!bar || !labels) return;
      
      const timezone = bar.dataset.timezone;
      if (!timezone) return;

      if (!syncMode) {
        // Non-sync mode: show standard 12am-12am range
        bar.style.transform = 'translateX(0)';
        labels.style.transform = 'translateX(0)';
      } else {
        // Sync mode: align current time to sync line position
        const time = getTimeInTimezone(timezone);
        const currentMinutes = time.getHours() * 60 + time.getMinutes();

        const currentPos = currentMinutes / MINUTES_PER_48_HOURS;
        const targetPos = SYNC_LINE_POSITION * 0.5;
        const shift = (currentPos - targetPos) * 100;

        bar.style.transform = `translateX(-${shift}%)`;
        labels.style.transform = `translateX(-${shift}%)`;
      }

      // Update current time indicator position
      const indicator = bar.querySelector('.current-time-indicator');
      if (indicator) {
        const time = getTimeInTimezone(timezone);
        const currentMinutes = time.getHours() * 60 + time.getMinutes();
        indicator.style.left = `${(currentMinutes / MINUTES_PER_48_HOURS) * 100}%`;
      }
    });
  }

  /**
   * Update current time indicators
   */
  updateCurrentTimeIndicators() {
    document.querySelectorAll('.timeline-row').forEach(row => {
      const bar = row.querySelector('.timeline-bar');
      if (!bar) return;
      
      const timezone = bar.dataset.timezone;
      if (!timezone) return;
      
      const indicator = bar.querySelector('.current-time-indicator');
      if (!indicator) return;

      const time = getTimeInTimezone(timezone);
      const currentMinutes = time.getHours() * 60 + time.getMinutes();

      const posPercent = (currentMinutes / MINUTES_PER_48_HOURS) * 100;
      indicator.style.left = `${posPercent}%`;
    });
  }

  /**
   * Update all time displays
   */
  updateClocks() {
    const use24Hour = store.get('use24Hour');

    document.querySelectorAll('.timeline-time').forEach(el => {
      const tz = el.dataset.tz;
      const time = getTimeInTimezone(tz);
      el.textContent = formatTime(time, use24Hour);
    });

    document.querySelectorAll('.timeline-date').forEach(el => {
      const tz = el.dataset.tzDate;
      const time = getTimeInTimezone(tz);
      el.textContent = formatDate(time);
    });

    this.syncTimelines();
  }
}

export { TimelineComponent };
export default TimelineComponent;
