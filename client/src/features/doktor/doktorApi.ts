import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pregled } from "../../models/Pregled";
import type { CreatePregledInfoSchema } from "../../lib/schemas/createPregledSchema";

export const doktorApi = createApi({
  reducerPath: "doktorApi",
  baseQuery: customBaseQuery,
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

  })
});

export const { useFetchPreglediQuery, useCreatePregledInfoMutation } = doktorApi;
