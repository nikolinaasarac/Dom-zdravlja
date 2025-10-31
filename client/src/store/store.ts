import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { pacijentApi } from "../features/PrikazPacijenata/pacijentApi";
import { pacijentSlice } from "../features/PrikazPacijenata/pacijentSlice";
import { authSlice } from "../features/Login/authSlice";
import { adminApi } from "../features/admin/adminApi";
import { doktorApi } from "../features/doktor/doktorApi";
import { korisnikApi } from "../features/korisnik/korisnikApi";
import { zahtjevApi } from "../features/Nalazi/zahtjevApi";
import { nalazApi } from "../features/Nalazi/nalazApi";
import { doktorSlice } from "../features/PrikazDoktora/doktorSlice";
import { tehnicarSlice } from "../features/PrikaziTehnicare/tehnicarSlice";

export const store = configureStore({
  reducer: {
    [pacijentApi.reducerPath]: pacijentApi.reducer,
    pacijent: pacijentSlice.reducer,
    auth: authSlice.reducer,
    doktor: doktorSlice.reducer,
    tehnicar: tehnicarSlice.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [doktorApi.reducerPath]: doktorApi.reducer,
    [korisnikApi.reducerPath]: korisnikApi.reducer,
    [zahtjevApi.reducerPath]: zahtjevApi.reducer,
    [nalazApi.reducerPath]: nalazApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pacijentApi.middleware,
      adminApi.middleware,
      doktorApi.middleware,
      korisnikApi.middleware,
      zahtjevApi.middleware,
      nalazApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
