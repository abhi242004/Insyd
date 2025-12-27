const MAX_TIMEOUT = 2; // ~23 days (safe)

export function scheduleTask(fn, delay) {
  if (delay <= MAX_TIMEOUT) {
    return setTimeout(fn, delay);
  }

  // Break long delays into chunks
  setTimeout(() => {
    scheduleTask(fn, delay - MAX_TIMEOUT);
  }, MAX_TIMEOUT);
}