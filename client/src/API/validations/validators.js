import { GENDER_OPTIONS, OTP_LENGTH } from "src/utils/constants";

// Allow http(s) so locally-served uploads (http://localhost/uploads/..) validate alongside Cloudinary https URLs.
export const FILE_URL_REGEX = /^https?:\/\/.*\/[^\/]+\.(webp|png|jpe?g|pdf|docx?)$/i;

export const validatePhoneNumber = (mobileNo) => /^(0|91)?[6-9][0-9]{9}$/.test(mobileNo);
export const validateObjectId = (objectId) => /^[0-9a-fA-F]{24}$/.test(objectId);
export const validateEmail = (email) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
export const validateDomain = (domain) => /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(String(domain).toLowerCase());
export const validateOTP = (otp) => otp && otp.length === OTP_LENGTH;
export const validatePinCode = (pin) => /^[1-9][0-9]{5}$/.test(Number(pin));
export const validateLatitude = (lat) => lat >= -90 && lat <= 90;
export const validateLongitude = (long) => long >= -180 && long <= 180;
export const validateRangeNumber = (n, min, max) => parseInt(n) <= max && parseInt(n) >= min;
export const validateStringLength = (s, min, max) => s && s.length <= max && s.length >= min;
export const validateGender = (g) => Object.values(GENDER_OPTIONS).includes(g);
export const validateFileName = (fileName) => /^[a-f0-9]{24}_[a-f0-9]{32}\.(webp|png|jpe?g|pdf|doc?x)$/i.test(fileName);
export const validateFileUrl = (fileUrl) => FILE_URL_REGEX.test(fileUrl);
export const validateTimestamp = (timestamp) => validateRangeNumber(timestamp, -8640000000000, 8640000000000);
export const validateUUIDv4 = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
export const validateTimein24hrs = (t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t);
export const validateFinancialYear = (y) => /^[0-9]{4}-[0-9]{2}$/.test(y);
export const validatePan = (p) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(p);
export const validateIFSC = (i) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(i);
