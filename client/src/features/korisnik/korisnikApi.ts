import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Korisnik } from "./Korisnik";

export const korisnikApi = createApi({
  reducerPath: "korisnikApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getMyAccount: builder.query<Korisnik, void>({
      query: () => "korisnici/mojNalog",
    }),
    updateUsername: builder.mutation<
      { username: string },
      { username: string }
    >({
      query: (body) => ({
        url: "korisnici/promijeniUsername",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetMyAccountQuery, useUpdateUsernameMutation } = korisnikApi;
