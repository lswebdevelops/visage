// frontend/src/slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    initialLoadComplete: false,
  },
  reducers: {
    setInitialLoadComplete: (state, action) => {
      state.initialLoadComplete = action.payload;
    },
  },
});

export const { setInitialLoadComplete } = appSlice.actions;
export default appSlice.reducer;
