import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { pacijentApi } from "../features/PrikazPacijenata/pacijentApi";
import { pacijentSlice } from "../features/PrikazPacijenata/pacijentSlice";
import { authSlice } from "../features/Login/authSlice";


export const store = configureStore({
  reducer: {
    [pacijentApi.reducerPath]: pacijentApi.reducer,
    pacijent : pacijentSlice.reducer,
     auth: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pacijentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
