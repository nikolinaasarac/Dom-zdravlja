import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { Vakcinacija } from "../../models/Vakcinacija";
import type { PacijentParams } from "../../models/PacijentParams";
import type { Pagination } from "../../models/pagination";
import type { Pregled } from "../../models/Pregled";
import type { Uputnica, UputnicaDto } from "../../models/Uputnica";

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
  }),
});

export const {
  useFetchPacijentVakcineQuery,
  useFetchPacijentiQuery,
  useFetchPacijentPreglediQuery,
  useFetchPacijentByIdQuery,
  useCreateUputnicaMutation,
  useFetchUputniceQuery
} = pacijentApi;
