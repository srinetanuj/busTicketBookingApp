import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchCriteria: {
    fromCity: "",
    toCity: "",
    date: "",
  },
  buses: [],
  selectedBus: null,
  loading: false,
  error: null,
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setSearchCriteria: (state, action) => {
      state.searchCriteria = action.payload;
    },
    setBuses: (state, action) => {
      state.buses = action.payload;
    },
    setSelectedBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchCriteria,
  setBuses,
  setSelectedBus,
  setLoading,
  setError,
} = busSlice.actions;

export default busSlice.reducer;
