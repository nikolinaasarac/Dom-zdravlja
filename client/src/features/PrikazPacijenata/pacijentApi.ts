import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { Vakcinacija } from "../../models/Vakcinacija";
import type { PacijentParams } from "../../models/PacijentParams";

export const pacijentApi = createApi({
  reducerPath: "pacijentApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchPacijenti: builder.query<Pacijent[], PacijentParams>({
      query: (pacijentParams) => {
        return {
          url: "pacijenti",
          params: pacijentParams
        }
      },
    }),
    fetchPacijentVakcine: builder.query<Vakcinacija[], number>({
      query: (pacijentId) => `vakcinacije/${pacijentId}`,
    }),
  }),
});

export const { useFetchPacijentVakcineQuery, useFetchPacijentiQuery } =
  pacijentApi;
