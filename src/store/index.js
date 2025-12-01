import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./busSlice";
import bookingReducer from "./bookingSlice";

export const store = configureStore({
  reducer: {
    bus: busReducer,
    booking: bookingReducer,
  },
});
