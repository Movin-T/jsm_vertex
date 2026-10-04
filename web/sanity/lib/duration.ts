export function durationInSeconds(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  if (!value) return 0;

  const duration = value.trim();
  if (/^\d+$/.test(duration)) return Number(duration);

  const clockParts = duration.split(':').map(Number);
  if (
    clockParts.length === 2 &&
    clockParts.every(Number.isFinite)
  ) {
    return clockParts[0] * 60 + clockParts[1];
  }
  if (
    clockParts.length === 3 &&
    clockParts.every(Number.isFinite)
  ) {
    return clockParts[0] * 3600 + clockParts[1] * 60 + clockParts[2];
  }

  const units = [...duration.matchAll(/(\d+(?:\.\d+)?)\s*(h|m|s)/gi)];
  return units.reduce((total, [, amount, unit]) => {
    const multiplier =
      unit.toLowerCase() === 'h'
        ? 3600
        : unit.toLowerCase() === 'm'
          ? 60
          : 1;
    return total + Number(amount) * multiplier;
  }, 0);
}

export function formatDuration(seconds: number) {
  if (seconds <= 0) return null;

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (totalMinutes > 0 && remainingSeconds > 0) {
    return `${totalMinutes}m ${remainingSeconds}s`;
  }
  if (totalMinutes > 0) return `${totalMinutes}m`;
  return `${remainingSeconds}s`;
}
