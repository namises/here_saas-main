import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { MAX_FILE_SIZE } from "../../utils/constants.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

async function handler(req, res) {
  try {
    console.log({ f: req.files });
    const file = req.files["files[]"];
    console.log({ file });
    if (!file) throw new Error("File not found");
    const { mimetype, name, tempFilePath, size } = file;
    console.log({ tempFilePath, name });
    const removeFile = async () => {
      try {
        await fs.access(tempFilePath);
        await fs.unlink(tempFilePath);
      } catch (_) {}
    };
    if (size > MAX_FILE_SIZE) {
      await removeFile();
      throw new Error("File size exceeds 2MB limit.");
    }
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      await removeFile();
      throw new Error("Invalid file type. Only images and documents are allowed.");
    }

    const upload = await cloudinary.uploader.upload(tempFilePath, {
      filename_override: name,
      resource_type: "auto",
      folder: "here",
      unique_filename: true,
    });
    const url = upload.secure_url;
    await removeFile();
    return handleResponse(res, {
      message: "Asset uploaded successfully",
      url,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
