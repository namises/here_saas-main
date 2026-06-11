import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (p, a) => {
      return { ...a.payload };
    },
    updateUser: (p, a) => {
      return { ...p, ...a.payload };
    },
    logout: () => {
      return null;
    },
  },
});

const user = userSlice.reducer;

const { setUser, updateUser, logout } = userSlice.actions;

export { setUser, updateUser, logout, user };
