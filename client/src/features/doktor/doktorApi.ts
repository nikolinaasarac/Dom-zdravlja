import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pregled } from "../../models/Pregled";
import type { Doktor } from "../../models/Doktor";
import type { CreateZahtjevSchema } from "../../lib/schemas/createZahtjevSchema";
import type { ZahtjevZaPregled } from "../../models/ZahtjevZaPregled";

export const doktorApi = createApi({
  reducerPath: "doktorApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchPregledi: builder.query<Pregled[], void>({
      query: () => `pregledi/doktor/pregledi`,
    }),
    fetchDoktori: builder.query<Doktor[], void>({
      query: () => `doktori`
    }),
    createZahtjev: builder.mutation<ZahtjevZaPregled, CreateZahtjevSchema>({
      query: (body) => ({
        url: "ZahtjevZaPregled",
        method: "POST",
        body,
      }),
    }),
    getMojiZahtjevi: builder.query<ZahtjevZaPregled[], void>({
      query: () => `ZahtjevZaPregled/moji-zahtjevi`,
    }),
  })
});

export const { useFetchPreglediQuery, useFetchDoktoriQuery, useCreateZahtjevMutation, useGetMojiZahtjeviQuery } = doktorApi;
