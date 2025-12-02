import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSeats: [],
  totalFare: 0,
  passengerInfo: [
    {
      firstName: "anuj",
      lastName: "singh",
      age: "",
      gender: "",
    },
  ],
  contactInfo: {
    email: "anuj@gmail.com",
    phone: "",
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
  },
});

export const { addSeat, removeSeat } = bookingSlice.actions;

export default bookingSlice.reducer;
