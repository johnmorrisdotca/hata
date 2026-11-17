// Dates as the flags' history reads them: a day, a month or a year, written the ISO way, compared as text. A flag's
// `from` and `until` (a `Variant`) are written as precisely as a source gives them, and a date asked for is too.

const SHAPE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

const real = (year: number, month: number, day: number): boolean => {
  const made = new Date(Date.UTC(year, month - 1, day));

  return made.getUTCFullYear() === year && made.getUTCMonth() === month - 1 && made.getUTCDate() === day;
};

const pad = (value: number, width: number): string => String(value).padStart(width, "0");

/**
 * The first day of a date written as a year, a month or a day, as `YYYY-MM-DD`: "1962" is "1962-01-01", "1962-09" is
 * "1962-09-01". A `Date` is read in UTC. Anything else is not a date, and throws.
 *
 * @throws TypeError when `date` is not a valid `Date` or a string of the form `YYYY`, `YYYY-MM` or `YYYY-MM-DD` naming a real day.
 */
const dayOf = (date: unknown): string => {
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) throw new TypeError("date must be a valid Date");

    return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}`;
  }
  const found = typeof date === "string" ? SHAPE.exec(date.trim()) : null;
  if (found === null) throw new TypeError("date must be a Date or a string like \"1962\", \"1962-09\" or \"1962-09-29\"");
  const [year, month, day] = [Number(found[1]), Number(found[2] ?? 1), Number(found[3] ?? 1)];
  if (!real(year, month, day)) throw new TypeError(`date "${date as string}" is not a real day`);

  return `${found[1]}-${pad(month, 2)}-${pad(day, 2)}`;
};

/** The first day after a date written as a year, a month or a day: "1972" ends on "1973-01-01", "1972-12" on "1973-01-01", "1972-12-31" on "1973-01-01". */
const dayAfter = (written: string): string => {
  const found = SHAPE.exec(written)!;
  if (found[3] !== undefined) {
    const next = new Date(Date.UTC(Number(found[1]), Number(found[2]) - 1, Number(found[3]) + 1));

    return `${pad(next.getUTCFullYear(), 4)}-${pad(next.getUTCMonth() + 1, 2)}-${pad(next.getUTCDate(), 2)}`;
  }
  if (found[2] !== undefined) {
    const next = new Date(Date.UTC(Number(found[1]), Number(found[2]), 1));

    return `${pad(next.getUTCFullYear(), 4)}-${pad(next.getUTCMonth() + 1, 2)}-01`;
  }

  return `${pad(Number(found[1]) + 1, 4)}-01-01`;
};

export { dayAfter, dayOf };
