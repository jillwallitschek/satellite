import { format } from "date-fns";

export type DateLike = Date | number | null | undefined;

/**
 * Formats a date into a string
 * @param dateLike - a date like value
 * @returns formatted string
 */
export function formatDate(dateLike: DateLike): string {
  if (dateLike === null || dateLike === undefined) {
    return "";
  }
  const date = typeof dateLike === "number" ? new Date(dateLike) : dateLike;
  return format(date, "MM/dd/yyyy");
}

export function isValidDate(value: string | undefined) {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}
