import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { Vakcinacija } from "../../models/Vakcinacija";
import type { PacijentParams } from "../../models/PacijentParams";
import type { Pagination } from "../../models/pagination";
import type { Pregled } from "../../models/Pregled";
import type { Uputnica, UputnicaDto } from "../../models/Uputnica";
import type { Recept, ReceptDto } from "../../models/Recept";

export const pacijentApi = createApi({
  reducerPath: "pacijentApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchPacijenti: builder.query<
      { pacijenti: Pacijent[]; pagination: Pagination },
      PacijentParams
    >({
      query: (pacijentParams) => {
        return {
          url: "pacijenti",
          params: pacijentParams,
        };
      },
      transformResponse: (pacijenti: Pacijent[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { pacijenti, pagination };
      },
    }),
    fetchPacijentVakcine: builder.query<Vakcinacija[], number>({
      query: (pacijentId) => `vakcinacije/${pacijentId}`,
    }),
    fetchPacijentById: builder.query<Pacijent, number>({
      query: (id) => `pacijenti/${id}`,
    }),
    fetchPacijentPregledi: builder.query<Pregled[], number>({
      query: (pacijentId) => `pregledi/${pacijentId}`,
    }),
    fetchUputnice: builder.query<Uputnica[], number | void>({
      query: (id) => `uputnice/${id}`,
    }),

    createUputnica: builder.mutation<Uputnica, { pacijentId: number; data: UputnicaDto }>({
      query: ({ pacijentId, data }) => ({
        url: `uputnice/${pacijentId}`,
        method: "POST",
        body: data,
      }),
    }),
    fetchRecepti: builder.query<Recept[], number | void>({
      query: (id) => `recepti/${id}`,
    }),

    createRecepti: builder.mutation<Recept, { pacijentId: number; data: ReceptDto }>({
      query: ({ pacijentId, data }) => ({
        url: `recepti/${pacijentId}`,
        method: "POST",
        body: data,
      }),
    }),

    getReceptPdf: builder.query<Blob, number>({
      query: (id) => ({
        url: `recepti/${id}/pdf`,
        responseHandler: (response) => response.blob(),
      }),
    }),
     getUputnicaPdf: builder.query<Blob, number>({
      query: (id) => ({
        url: `uputnice/${id}/pdf`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPacijentVakcineQuery,
  useFetchPacijentiQuery,
  useFetchPacijentPreglediQuery,
  useFetchPacijentByIdQuery,
  useCreateUputnicaMutation,
  useFetchUputniceQuery,
  useFetchReceptiQuery,
  useCreateReceptiMutation,
  useLazyGetReceptPdfQuery,
  useLazyGetUputnicaPdfQuery
} = pacijentApi;
