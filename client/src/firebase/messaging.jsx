import { API } from "src/API/api";
import { getToken, messaging } from ".";

export const updateToken = async () => {
  try {
    const fcmToken = await getToken(messaging, {
      vapidKey: "BAs5DD8ciE6SeftnQp_iYgADUS6QsfDaEV20MG4mShEzjG2WF5STLgb-BQCBIQbBwqYGJeGUeWC41Thz29ijqXY",
    });

    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      await API.fcm.add({ fcmToken });
    } else {
      console.warn("No registration token available. Request permission to generate one.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};
