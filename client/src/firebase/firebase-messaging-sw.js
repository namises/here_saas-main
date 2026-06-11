importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCZ1o51tJOyc8RAvudllScdkCSQ3Db5Y-Q",
  authDomain: "here-6b1b4.firebaseapp.com",
  projectId: "here-6b1b4",
  storageBucket: "here-6b1b4.firebasestorage.app",
  messagingSenderId: "664481977011",
  appId: "1:664481977011:web:c2dfffc29e05fb5ea4d6c6",
  measurementId: "G-0TWSLJ8X42",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const { title, body, icon } = payload.notification;
  try {
    self.registration.showNotification(title, {
      body,
      icon,
      data: {
        url: payload.fcmOptions?.link || "/",
      },
    });
    console.log("[SW] Notification dispatched:");
  } catch (err) {
    console.error("[SW] Error showing notification:", err);
  }
});
