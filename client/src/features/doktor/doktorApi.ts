import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pregled } from "../../models/Pregled";

export const doktorApi = createApi({
  reducerPath: "doktorApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchPregledi: builder.query<Pregled[], void>({
      query: () => `pregledi/doktor/pregledi`,
    })
  })
});

export const {useFetchPreglediQuery} = doktorApi;
