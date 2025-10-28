import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pregled } from "../../models/Pregled";
import type { CreatePregledInfoSchema } from "../../lib/schemas/createPregledSchema";
import type { Doktor } from "../../models/Doktor";
import type { CreateZahtjevSchema } from "../../lib/schemas/createZahtjevSchema";
import type { ZahtjevZaPregled } from "../../models/ZahtjevZaPregled";

export const doktorApi = createApi({
  reducerPath: "doktorApi",
  baseQuery: customBaseQuery,

  // ✅ Dodaj tagTypes
  tagTypes: ["Zahtjevi"],

  endpoints: (builder) => ({
    fetchPregledi: builder.query<Pregled[], void>({
      query: () => `pregledi/doktor/pregledi`,
    }),

    createPregledInfo: builder.mutation<
      Pregled,
      { id: number; data: CreatePregledInfoSchema }
    >({
      query: ({ id, data }) => ({
        url: `pregledi/obradi/${id}`,
        method: "PUT",
        body: {
          Dijagnoza: data.dijagnoza,
          Terapija: data.terapija,
          Napomena: data.napomena ?? null,
        },
      }),
    }),

    fetchDoktori: builder.query<Doktor[], void>({
      query: () => `doktori`,
    }),

    // ✅ Ovdje dodaj invalidatesTags
    createZahtjev: builder.mutation<ZahtjevZaPregled, CreateZahtjevSchema>({
      query: (body) => ({
        url: "ZahtjevZaPregled",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Zahtjevi"], // ✅ Osvježava sve zahtjeve
    }),

    getMojiZahtjevi: builder.query<ZahtjevZaPregled[], void>({
      query: () => `ZahtjevZaPregled/moji-zahtjevi`,
      providesTags: ["Zahtjevi"], // ✅ Označava da koristi te podatke
    }),

    odobriZahtjev: builder.mutation<
      void,
      { id: number; datumPregleda: string }
    >({
      query: ({ id, datumPregleda }) => ({
        url: `ZahtjevZaPregled/odobri/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: `"${datumPregleda}"`,
      }),
      invalidatesTags: ["Zahtjevi"], // ✅ Osvježi prikaz zahtjeva nakon odobravanja
    }),

    odbijZahtjev: builder.mutation<void, number>({
      query: (id) => ({
        url: `ZahtjevZaPregled/odbij/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Zahtjevi"], // ✅ I ovdje
    }),
  }),
});

export const {
  useFetchPreglediQuery,
  useCreatePregledInfoMutation,
  useFetchDoktoriQuery,
  useCreateZahtjevMutation,
  useGetMojiZahtjeviQuery,
  useOdobriZahtjevMutation,
  useOdbijZahtjevMutation,
} = doktorApi;
