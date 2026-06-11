import admin from "firebase-admin";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import DB from "../db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "..", "firebase.json");

let firebaseInitialized = false;

const initializeFirebase = async () => {
  if (!firebaseInitialized) {
    const serviceAccountBuffer = await readFile(serviceAccountPath, { encoding: "utf8" });
    const serviceAccount = JSON.parse(serviceAccountBuffer.toString());
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
  }
};

export const sendNotification = async (employee, title, body, icon = "https://res.cloudinary.com/doukudlyp/image/upload/v1750353308/logo_bqmk9k.jpg", click_action) => {
  await initializeFirebase();
  try {
    const tokenDoc = await DB.FCM.findOne({ employee });
    if (!tokenDoc) {
      console.error("❌ No FCM token found for employee:", employee);
      return;
    }
    for (const token of tokenDoc.fcmTokens) {
      const message = { token, notification: { title, body }, webpush: { notification: { icon, click_action } } };
      await admin.messaging().send(message);
      console.log("✅ Notification sent successfully:");
    }
    return;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return;
  }
};
