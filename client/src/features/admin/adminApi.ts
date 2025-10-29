import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { CreatePacijentSchema } from "../../lib/schemas/createPacijentSchema";
import type { Korisnik } from "../../models/Korisnik";
import type { CreateKorisnikSchema } from "../../lib/schemas/createKorisnikSchema";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchPacijenti: builder.query<Pacijent[], void>({
      query: () => "pacijenti",
    }),
    createPacijent: builder.mutation<Pacijent, CreatePacijentSchema>({
      query: (data) => ({
        url: "pacijenti",
        method: "POST",
        body: data, // sada šalješ JSON
      }),
    }),
    updatePacijent: builder.mutation<
      void,
      { id: number; data: CreatePacijentSchema }
    >({
      query: ({ id, data }) => ({
        url: `pacijenti`,
        method: "PUT",
        body: { id, ...data }, // JSON
      }),
    }),
    deletePacijent: builder.mutation<void, number>({
      query: (id) => ({
        url: `pacijenti/${id}`,
        method: "DELETE",
      }),
    }),
    fetchKorisnici: builder.query<Korisnik[], void>({
      query: () => "korisnici",
    }),
    createKorisnik: builder.mutation<Pacijent, CreateKorisnikSchema>({
      query: (data) => ({
        url: "korisnici",
        method: "POST",
        body: data, // sada šalješ JSON
      }),
    }),
    deleteKorisnik: builder.mutation<void, string>({
      query: (id) => ({
        url: `korisnici/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPacijentiQuery,
  useCreatePacijentMutation,
  useDeletePacijentMutation,
  useUpdatePacijentMutation,
  useFetchKorisniciQuery,
  useCreateKorisnikMutation,
  useDeleteKorisnikMutation,
} = adminApi;
