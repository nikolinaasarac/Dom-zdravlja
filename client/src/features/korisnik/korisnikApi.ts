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
    promijeniLozinku: builder.mutation<
      { message: string },
      { novaLozinka: string; potvrdiLozinku: string }
    >({
      query: (body) => ({
        url: "korisnici/promijeniLozinku",
        method: "PUT",
        body: {
          NovaLozinka: body.novaLozinka,
          NovaLozinkaPotvrda: body.potvrdiLozinku,
        },
      }),
    }),
    promijeniLozinkuAdmin: builder.mutation<
      { message: string },
      { userId: string; novaLozinka: string; potvrdiLozinku: string }
    >({
      query: ({ userId, novaLozinka, potvrdiLozinku }) => ({
        url: `korisnici/promijeniLozinku/${userId}`,
        method: "PUT",
        body: {
          NovaLozinka: novaLozinka,
          NovaLozinkaPotvrda: potvrdiLozinku,
        },
      }),
    }),
  }),
});

export const {
  useGetMyAccountQuery,
  useUpdateUsernameMutation,
  usePromijeniLozinkuMutation,
  usePromijeniLozinkuAdminMutation,
} = korisnikApi;
