import dayjs from "dayjs";
import Joi from "joi";
import { Types } from "mongoose";

export const objectIdValidator = Joi.string().length(24).hex().message("Invalid ObjectId format");
export const timestampValidator = Joi.number().integer().min(-8640000000000).max(8640000000000).message("Invalid timestamp");
export const validatePassword = Joi.string().min(6).required();
export const validateFinancialYear = Joi.string().pattern(/^[0-9]{4}-[0-9]{2}$/);
export const validateUUIDv4 = Joi.string().guid({ version: ["uuidv4"] });
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
// Allow http(s) so locally-served uploads (http://localhost/uploads/..) validate alongside Cloudinary https URLs.
export const FILE_URL_REGEX = /^https?:\/\/.*\/[^\/]+\.(webp|png|jpe?g)$/i;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const castToObjectId = (id) => new Types.ObjectId(id);
export const getURLInitials = (url) => (url.includes("?") ? url.slice(0, url.indexOf("?")) : url);
export const sanitizeObject = (o) => Object.entries(o).reduce((p, [k, v]) => (v === undefined ? p : { ...p, [k]: v }), {});
export const now = () => parseInt(Date.now() / 1000, 10);
export const getMonthsDiff = (startDate, endDate) => {
  const start = dayjs.unix(startDate),
    end = dayjs.unix(endDate);
  return (end.year() - start.year()) * 12 + (end.month() - start.month());
};
export function getFinancialYearFromUnix(startUnixTimestamp, locale) {
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

  const parts = locale.split("-");
  const countryCode = parts.length > 1 ? parts[1].toUpperCase() : "US";
  const fiscal = fiscalDefinitions[countryCode] || fiscalDefinitions["US"];

  const now = new Date();
  const nowYear = now.getFullYear();
  const fiscalStartThisYear = new Date(nowYear, fiscal.startMonth - 1, fiscal.startDay);
  let currentFiscalYearStart = now < fiscalStartThisYear ? nowYear - 1 : nowYear;

  const result = [];

  const startDate = new Date(startUnixTimestamp * 1000);
  const startYear = startDate.getFullYear();
  const fiscalStartStartYear = new Date(startYear, fiscal.startMonth - 1, fiscal.startDay);
  let firstFiscalYearStart = startDate < fiscalStartStartYear ? startYear - 1 : startYear;

  for (let y = firstFiscalYearStart; y <= currentFiscalYearStart; y++) {
    const endYearShort = String(y + 1).slice(-2);
    result.push(`${y}-${endYearShort}`);
  }

  return result;
}
