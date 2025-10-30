import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";

export interface Nalaz {
  id: number;
  pacijentId: number;
  tehnicarId?: number;
  filePath: string;
  datumDodavanja: string;
  pacijentIme: string;
  pacijentPrezime: string;
  tehnicarIme?: string;
  tehnicarPrezime?: string;
}

export const nalazApi = createApi({
  reducerPath: "nalazApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Nalazi"],
  endpoints: (builder) => ({
    getNalaziPacijenta: builder.query<Nalaz[], number>({
      query: (pacijentId) => `Nalazi/pacijent/${pacijentId}`,
      providesTags: ["Nalazi"],
    }),
  }),
});

export const { useGetNalaziPacijentaQuery } = nalazApi;
