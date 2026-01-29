import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { Vakcinacija } from "../../models/Vakcinacija";
import type { PacijentParams } from "../../models/PacijentParams";
import type { Pagination } from "../../models/pagination";
import type { Pregled } from "../../models/Pregled";
import type { Uputnica, UputnicaDto } from "../../models/Uputnica";
import type { Recept, ReceptDto } from "../../models/Recept";
import type { KrvnaGrupa } from "../../models/KrvnaGrupa";
import type { CreateKrvnaGrupaSchema } from "../../lib/schemas/createKrvnaGrupaSchema";
import type { Doktor } from "../../models/Doktor";

export const pacijentApi = createApi({
  reducerPath: "pacijentApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Recepti"],
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
    fetchDoktori: builder.query<Doktor[], void>({
      query: () => `doktori`,
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

    createUputnica: builder.mutation<
      Uputnica,
      { pacijentId: number; data: UputnicaDto }
    >({
      query: ({ pacijentId, data }) => ({
        url: `uputnice/${pacijentId}`,
        method: "POST",
        body: data,
      }),
    }),
    fetchRecepti: builder.query<Recept[], number | void>({
      query: (id) => `recepti/${id}`,
      providesTags: ["Recepti"],
    }),

    createRecepti: builder.mutation<
      Recept,
      { pacijentId: number; data: ReceptDto }
    >({
      query: ({ pacijentId, data }) => ({
        url: `recepti/${pacijentId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Recepti"],
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
    fetchKrvnaGrupa: builder.query<KrvnaGrupa, number>({
      query: (pacijentId) => `krvnegrupe/pacijent/${pacijentId}`,
    }),
    createKrvnaGrupa: builder.mutation<
      KrvnaGrupa,
      { pacijentId: number; data: CreateKrvnaGrupaSchema }
    >({
      query: ({ pacijentId, data }) => ({
        url: `krvnegrupe/pacijent/${pacijentId}`,
        method: "POST",
        body: data,
      }),
    }),
    updateKrvnaGrupa: builder.mutation<
      KrvnaGrupa,
      { pacijentId: number; data: CreateKrvnaGrupaSchema }
    >({
      query: ({ pacijentId, data }) => ({
        url: `krvnegrupe/pacijent/${pacijentId}`,
        method: "PUT",
        body: data,
      }),
    }),
    getMojPacijentId: builder.query<number | null, void>({
      query: () => ({
        url: "pacijenti/moj-id",
        method: "GET",
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
  useLazyGetUputnicaPdfQuery,
  useCreateKrvnaGrupaMutation,
  useUpdateKrvnaGrupaMutation,
  useFetchKrvnaGrupaQuery,
  useFetchDoktoriQuery,
  useGetMojPacijentIdQuery
} = pacijentApi;
