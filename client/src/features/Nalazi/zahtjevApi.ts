import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { ZahtjevZaAnalizu } from "../../models/ZahtjevZaAnalizu";
import type { CreateZahtjevAnalizuSchema } from "../../lib/schemas/createZahtjevZaAnalizuSchema";

export const zahtjevApi = createApi({
  reducerPath: "zahtjevApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ZahtjeviAnalize"],

  endpoints: (builder) => ({
    getZahtjevi: builder.query<ZahtjevZaAnalizu[], void>({
      query: () => "ZahtjevZaAnalizu",
      providesTags: ["ZahtjeviAnalize"],
    }),

    getZahtjeviDoktora: builder.query<ZahtjevZaAnalizu[], void>({
      query: () => "ZahtjevZaAnalizu/doktor",
      providesTags: ["ZahtjeviAnalize"],
    }),

    getZahtjeviPacijenta: builder.query<ZahtjevZaAnalizu[], number>({
      query: (pacijentId) => `ZahtjevZaAnalizu/pacijent/${pacijentId}`,
      providesTags: ["ZahtjeviAnalize"],
    }),

    getZahtjeviNaCekanju: builder.query<ZahtjevZaAnalizu[], void>({
      query: () => "ZahtjevZaAnalizu/na-cekanju",
      providesTags: ["ZahtjeviAnalize"],
    }),

    kreirajZahtjev: builder.mutation<
      ZahtjevZaAnalizu,
      { pacijentId: number; data: CreateZahtjevAnalizuSchema }
    >({
      query: ({ pacijentId, data }) => ({
        url: `ZahtjevZaAnalizu/pacijent/${pacijentId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ZahtjeviAnalize"],
    }),

    promijeniStatus: builder.mutation<
      void,
      { id: number; noviStatus: string }
    >({
      query: ({ id, noviStatus }) => ({
        url: `ZahtjevZaAnalizu/${id}/status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: {status: noviStatus},
      }),
      invalidatesTags: ["ZahtjeviAnalize"],
    }),

    zavrsiObradu: builder.mutation<
      { message: string; zahtjevId: number; nalazFilePath: string },
      { zahtjevId: number; formData: FormData }
    >({
      query: ({ zahtjevId, formData }) => ({
        url: `ZahtjevZaAnalizu/${zahtjevId}/zavrsi`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ZahtjeviAnalize"],
    }),
}),
});

export const {
  useGetZahtjeviQuery,
  useGetZahtjeviDoktoraQuery,
  useGetZahtjeviPacijentaQuery,
  useGetZahtjeviNaCekanjuQuery,
  useKreirajZahtjevMutation,
  usePromijeniStatusMutation,
  useZavrsiObraduMutation,
} = zahtjevApi;
