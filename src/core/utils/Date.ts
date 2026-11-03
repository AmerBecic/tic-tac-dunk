const getDateFormatLocale = (locale: string): string =>
  locale === 'bos' ? 'bs-BA' : locale;

export function formatDate(dateInput: string | Date, locale: string): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  // Calendar dates must retain their day regardless of the viewer's time zone.
  const isCalendarDate =
    typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput);
  if (isCalendarDate && date.toISOString().slice(0, 10) !== dateInput)
    return '';

  return new Intl.DateTimeFormat(getDateFormatLocale(locale), {
    timeZone: isCalendarDate
      ? 'UTC'
      : Intl.DateTimeFormat().resolvedOptions().timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
