import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const checkInTimeSlice = createSlice({
  name: "checkInTime",
  initialState,
  reducers: {
    updateCheckInTime: (prevState, action) => {
      return action.payload;
    },
    clearCheckInTime: (prevState, action) => {
      return null;
    },
  },
});

const checkInTime = checkInTimeSlice.reducer;

const { updateCheckInTime, clearCheckInTime } = checkInTimeSlice.actions;

export { updateCheckInTime, clearCheckInTime, checkInTime };
