export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(isoDate));

export const formatDateTime = (isoDate: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
