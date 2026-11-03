export const getDailyPuzzleDateError = (
  date: string,
  now: Date = new Date()
): string | null => {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return 'Invalid date. Expected a valid date in YYYY-MM-DD format.';
  }

  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const earliestDate = new Date(today);
  earliestDate.setUTCDate(earliestDate.getUTCDate() - 15);

  if (parsedDate < earliestDate || parsedDate > today) {
    return 'Daily puzzles are only available from today through 15 days ago.';
  }

  return null;
};
