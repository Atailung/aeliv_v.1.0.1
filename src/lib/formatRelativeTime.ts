export function formatRelativeTime(date: Date | string | number): string {
  const now = Date.now();
  const then = new Date(date).getTime();

  if (isNaN(then)) {
    return "Invalid date";
  }

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30; // approximate
  const msPerYear = msPerDay * 365; // approximate

  const elapsed = now - then;

  // Less than 1 minute
  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / 1000);
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  // Less than 1 hour
  if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  // Less than 1 day
  if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // 1 to 6 days
  const days = Math.floor(elapsed / msPerDay);
  if (days < 7) {
    return `${days === 1 ? "A day" : `${days} days`} ago`;
  }

  // 1 to 3 weeks
  const weeks = Math.floor(elapsed / msPerWeek);
  if (weeks < 4) {
    return `${weeks === 1 ? "A week" : `${weeks} weeks`} ago`;
  }

  // 1 to 11 months
  const months = Math.floor(elapsed / msPerMonth);
  if (months < 12) {
    return `${months === 1 ? "A month" : `${months} months`} ago`;
  }

  // Years
  const years = Math.floor(elapsed / msPerYear);
  return `${years === 1 ? "A year" : `${years} years`} ago`;
}
