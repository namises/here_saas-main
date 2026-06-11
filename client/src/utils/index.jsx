import { dateTypes } from "./constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const buildSearchQuery = (o) => {
  let r = Object.keys(o)
    .filter((k) => o[k] !== null && o[k] !== undefined && `${o[k]}`.length)
    .reduce((a, k) => ({ ...a, [k]: o[k] }), {});
  return new URLSearchParams(r).toString().length ? `?${new URLSearchParams(r).toString()}` : "";
};

export const isDesktop = () => (window.innerWidth > 500 ? true : false);

export const dateStringToUnix = (s, type = "exact") => {
  const date = new Date(s);
  switch (type) {
    case dateTypes.START:
      date.setHours(0, 0, 0, 0);
      break;
    case dateTypes.END:
      date.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }
  return Math.floor(date.getTime() / 1000);
};

export const startOfUtcDayInSeconds = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

export const unixToDateString = (u) => {
  const restoredDate = new Date(u * 1000);
  return restoredDate;
};

export const formatDurationinSec = (seconds) => {
  return dayjs.duration(seconds, "seconds").format("HH:mm:ss");
};

export const formatTimestampToHumandate = (t) => dayjs(t * 1000).format("DD MMM YYYY");
export const formatTimestampToHumandateTime = (t) => dayjs(t * 1000).format("DD MMM YYYY hh:mm A");

export const getFinancialYearFromLocale = (locale, unixTimestamp) => {
  const fiscalDefinitions = {
    IN: { startMonth: 4, startDay: 1 }, // India
    US: { startMonth: 10, startDay: 1 }, // USA (Federal)
    GB: { startMonth: 4, startDay: 6 }, // UK (Individual)
    AU: { startMonth: 7, startDay: 1 }, // Australia
    JP: { startMonth: 4, startDay: 1 }, // Japan
    CA: { startMonth: 4, startDay: 1 }, // Canada (Federal)
    DE: { startMonth: 1, startDay: 1 }, // Germany
    FR: { startMonth: 1, startDay: 1 }, // France
    AE: { startMonth: 1, startDay: 1 }, // UAE
    ZA: { startMonth: 3, startDay: 1 }, // South Africa
    SG: { startMonth: 4, startDay: 1 }, // Singapore
    CN: { startMonth: 1, startDay: 1 }, // China
    BR: { startMonth: 1, startDay: 1 }, // Brazil
    RU: { startMonth: 1, startDay: 1 }, // Russia
    SA: { startMonth: 1, startDay: 1 }, // Saudi Arabia
  };

  const timestamp = typeof unixTimestamp === "number" ? unixTimestamp : Date.now() / 1000;
  const date = new Date(timestamp * 1000);

  const parts = locale.split("-");
  const countryCode = parts.length > 1 ? parts[1].toUpperCase() : "US";

  const fiscal = fiscalDefinitions[countryCode] || fiscalDefinitions["US"];
  const fiscalStart = new Date(date.getFullYear(), fiscal.startMonth - 1, fiscal.startDay);

  let startYear = date.getFullYear();
  if (date < fiscalStart) {
    startYear -= 1;
  }

  const endYear = startYear + 1;
  return `${startYear}-${String(endYear).slice(-2)}`;
};
