import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";

import authSliceReducer from "./slices/authSlice";
import appSliceReducer from "./slices/appSlice"; // <- adicionado

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    app: appSliceReducer, // <- adicionado
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
