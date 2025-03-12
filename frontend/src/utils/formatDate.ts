// Format the date
export function formatDate(
  date: string | undefined,
  locale: string = 'en-US',
): string {
  if (!date) return '';

  return new Date(date).toLocaleString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
