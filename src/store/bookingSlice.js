import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSeats: [],
  totalFare: 0,
  passengerInfo: [
    {
      firstName: "Anuj",
      lastName: "Singh",
      age: "26",
      gender: "Male",
    },
  ],
  contactInfo: {
    email: "anuj@gmail.com",
    phone: "9876543212",
  },
  bookingDetails: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addSeat: (state, action) => {
      const seat = action.payload;
      const exists = state.selectedSeats.find(
        (s) => s.seatNumber === seat.seatNumber
      );
      if (!exists) {
        state.selectedSeats.push(seat);
        state.totalFare += seat.price;
        // ensure passengerInfo array is at least as long as selectedSeats
        if (state.passengerInfo.length < state.selectedSeats.length) {
          state.passengerInfo.push({
            firstName: "",
            lastName: "",
            age: "",
            gender: "",
          });
        }
      }
    },
    removeSeat: (state, action) => {
      const seatNumber = action.payload;
      const seat = state.selectedSeats.find((s) => s.seatNumber === seatNumber);
      if (seat) {
        state.totalFare -= seat.price;
        state.selectedSeats = state.selectedSeats.filter(
          (s) => s.seatNumber !== seatNumber
        );
        if (state.passengerInfo.length > state.selectedSeats.length) {
          state.passengerInfo = state.passengerInfo.slice(
            0,
            state.selectedSeats.length
          );
        }
      }
    },
    setPassengerInfoArray: (state, action) => {
      state.passengerInfo = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },
    setContactInfo: (state, action) => {
      state.contactInfo = { ...state.contactInfo, ...(action.payload || {}) };
    },
    updatePassengerAtIndex: (state, action) => {
      const { index, data } = action.payload;
      if (state.passengerInfo[index]) {
        state.passengerInfo[index] = {
          ...state.passengerInfo[index],
          ...data,
        };
      }
    },
    setBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetBooking: (state) => {
      return initialState;
    },
  },
});

export const {
  addSeat,
  removeSeat,
  setPassengerInfoArray,
  setContactInfo,
  updatePassengerAtIndex,
  setBookingDetails,
  setLoading,
  setError,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
