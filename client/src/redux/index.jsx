import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiStatus } from "src/redux/reducers/apiStatus";
import { user } from "src/redux/reducers/user";
import { checkInTime } from "src/redux/reducers/checkInTime";

const combinedReducer = combineReducers({
  apiStatus,
  user,
  checkInTime,
});

const rootReducer = (state, action) => {
  let stateData = state;
  if (action.type === "logout/clearReducer") {
    stateData = undefined;
  }
  return combinedReducer(stateData, action);
};

export const clearReducer = () => ({
  type: "logout/clearReducer",
});

const persistConfig = { key: "root-here-ezulix-redux-persist", storage, whitelist: ["user", "checkInTime"] };

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({ reducer: persistedReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }) });

export const persistor = persistStore(store);

export default store;
