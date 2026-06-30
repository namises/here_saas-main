// Media storage with a graceful local-disk fallback.
// If Cloudinary is properly configured (real CLOUDINARY_* env vars) it's used; otherwise files are
// written under server/uploads and served by Express at /uploads/* so the app works without any
// external account. Set real Cloudinary creds in .env to switch back to Cloudinary automatically.
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

// Values that mean "not really configured".
const PLACEHOLDER_CLOUD_NAMES = new Set(["", "here", "your_cloud_name", "your_dev_cloud_name"]);

export const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  return Boolean(name && !PLACEHOLDER_CLOUD_NAMES.has(name) && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });
const randomName = (ext) => `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
const normalizeExt = (ext) => {
  const e = (ext || "").toLowerCase();
  if (e === ".jpeg") return ".jpg";
  return e || ".jpg";
};

// Store a base64 data URL (e.g. a captured selfie). Returns a public URL.
export const storeDataUrl = async (dataUrl, { folder = "misc", baseUrl = "" } = {}) => {
  if (isCloudinaryConfigured()) {
    const up = await cloudinary.uploader.upload(dataUrl, { folder: `here/${folder}`, resource_type: "image", unique_filename: true });
    return up.secure_url;
  }
  const match = /^data:image\/(\w+);base64,(.+)$/s.exec(dataUrl);
  if (!match) throw new Error("Invalid image data");
  const ext = normalizeExt(`.${match[1]}`);
  const buffer = Buffer.from(match[2], "base64");
  const dir = path.join(UPLOADS_DIR, folder);
  await ensureDir(dir);
  const filename = randomName(ext);
  await fs.writeFile(path.join(dir, filename), buffer);
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Store a file already on disk (temp path from express-fileupload). Returns a public URL.
export const storeFile = async (tempPath, { originalName = "", folder = "misc", baseUrl = "" } = {}) => {
  if (isCloudinaryConfigured()) {
    const up = await cloudinary.uploader.upload(tempPath, { folder: `here/${folder}`, resource_type: "auto", unique_filename: true, filename_override: originalName });
    return up.secure_url;
  }
  const ext = normalizeExt(path.extname(originalName));
  const dir = path.join(UPLOADS_DIR, folder);
  await ensureDir(dir);
  const filename = randomName(ext);
  await fs.copyFile(tempPath, path.join(dir, filename));
  return `${baseUrl}/uploads/${folder}/${filename}`;
};
