(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PerchSchedule = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DEFAULT_SCHEDULE = {
    wakeTime: '07:00',
    sleepTime: '23:00',
    workStart: '09:00',
    workEnd: '17:00'
  };

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function parseTimeToFraction(value) {
    const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return (hours * 60 + minutes) / (24 * 60);
  }

  function normalizeTime(value, fallback) {
    const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return fallback;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return fallback;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return fallback;
    return `${pad2(hours)}:${pad2(minutes)}`;
  }

  function normalizeSchedule(raw = {}) {
    return {
      wakeTime: normalizeTime(raw.wakeTime, DEFAULT_SCHEDULE.wakeTime),
      sleepTime: normalizeTime(raw.sleepTime, DEFAULT_SCHEDULE.sleepTime),
      workStart: normalizeTime(raw.workStart, DEFAULT_SCHEDULE.workStart),
      workEnd: normalizeTime(raw.workEnd, DEFAULT_SCHEDULE.workEnd)
    };
  }

  /** Inclusive-start exclusive-end ranges in 0..1 that may wrap midnight. */
  function wrapRanges(startFrac, endFrac) {
    if (!Number.isFinite(startFrac) || !Number.isFinite(endFrac)) return [];
    const start = ((startFrac % 1) + 1) % 1;
    const end = ((endFrac % 1) + 1) % 1;
    if (Math.abs(start - end) < 1e-9) return [];
    if (start < end) return [{ start, end }];
    return [
      { start, end: 1 },
      { start: 0, end }
    ];
  }

  function scheduleBands(schedule) {
    const s = normalizeSchedule(schedule);
    const wake = parseTimeToFraction(s.wakeTime);
    const sleep = parseTimeToFraction(s.sleepTime);
    const workStart = parseTimeToFraction(s.workStart);
    const workEnd = parseTimeToFraction(s.workEnd);

    return {
      sleep: wrapRanges(sleep, wake),
      work: wrapRanges(workStart, workEnd)
    };
  }

  function formatHourLabel(hour) {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    if (hour < 12) return `${hour}a`;
    return `${hour - 12}p`;
  }

  return {
    DEFAULT_SCHEDULE,
    parseTimeToFraction,
    normalizeTime,
    normalizeSchedule,
    wrapRanges,
    scheduleBands,
    formatHourLabel
  };
});
