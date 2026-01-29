import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { CreatePacijentSchema } from "../../lib/schemas/createPacijentSchema";
import type { Korisnik } from "../../models/Korisnik";
import type { CreateKorisnikSchema } from "../../lib/schemas/createKorisnikSchema";
import type { Doktor } from "../korisnik/Korisnik";
import type { CreateDoktorSchema } from "../../lib/schemas/createDoktorSchema";
import type { Tehnicar } from "../../models/Tehnicar";
import type { CreateTehnicarSchema } from "../../lib/schemas/createTehnicarSchema";
import type { Pagination } from "../../models/pagination";
import type { TehnicarParams } from "../../models/TehnicarParams";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Korisnici"],
  endpoints: (builder) => ({
    createPacijent: builder.mutation<Pacijent, CreatePacijentSchema>({
      query: (data) => ({
        url: "pacijenti",
        method: "POST",
        body: data,
      }),
    }),
    updatePacijent: builder.mutation<
      void,
      { id: number; data: CreatePacijentSchema }
    >({
      query: ({ id, data }) => ({
        url: `pacijenti`,
        method: "PUT",
        body: { id, ...data }, 
      }),
    }),
    deletePacijent: builder.mutation<void, number>({
      query: (id) => ({
        url: `pacijenti/${id}`,
        method: "DELETE",
      }),
    }),
    createDoktor: builder.mutation<Doktor, CreateDoktorSchema>({
      query: (data) => ({
        url: "doktori",
        method: "POST",
        body: data, 
      }),
    }),
    updateDoktor: builder.mutation<
      void,
      { id: number; data: CreateDoktorSchema }
    >({
      query: ({ id, data }) => ({
        url: `doktori`,
        method: "PUT",
        body: { id, ...data },
      }),
    }),
    deleteDoktor: builder.mutation<void, number>({
      query: (id) => ({
        url: `doktori/${id}`,
        method: "DELETE",
      }),
    }),
    fetchTehnicari: builder.query<
      { tehnicari: Tehnicar[]; pagination: Pagination },
      TehnicarParams
    >({
      query: (tehnicarParams) => {
        return {
          url: "tehnicari",
          params: tehnicarParams,
        };
      },
      transformResponse: (tehnicari: Tehnicar[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { tehnicari, pagination };
      },
    }),
    createTehnicar: builder.mutation<Tehnicar, CreateTehnicarSchema>({
      query: (data) => ({
        url: "tehnicari",
        method: "POST",
        body: data, 
      }),
    }),
    updateTehnicar: builder.mutation<
      void,
      { id: number; data: CreateTehnicarSchema }
    >({
      query: ({ id, data }) => ({
        url: `tehnicari`,
        method: "PUT",
        body: { id, ...data },
      }),
    }),
    deleteTehnicar: builder.mutation<void, number>({
      query: (id) => ({
        url: `tehnicari/${id}`,
        method: "DELETE",
      }),
    }),
    fetchKorisnici: builder.query<Korisnik[], void>({
      query: () => "korisnici",
      providesTags: ["Korisnici"],
    }),
    createKorisnik: builder.mutation<Korisnik, CreateKorisnikSchema>({
      query: (data) => ({
        url: "korisnici/kreiraj-nalog",
        method: "POST",
        body: data, 
      }),
      invalidatesTags: ["Korisnici"],
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
  useFetchTehnicariQuery,
  useCreatePacijentMutation,
  useDeletePacijentMutation,
  useUpdatePacijentMutation,
  useFetchKorisniciQuery,
  useCreateKorisnikMutation,
  useDeleteKorisnikMutation,
  useDeleteDoktorMutation,
  useCreateDoktorMutation,
  useUpdateDoktorMutation,
  useCreateTehnicarMutation,
  useUpdateTehnicarMutation,
  useDeleteTehnicarMutation,
} = adminApi;
