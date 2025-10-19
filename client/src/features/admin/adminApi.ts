import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../app/api/baseApi";
import type { Pacijent } from "../../models/Pacijent";
import type { CreatePacijentSchema } from "../../lib/schemas/createPacijentSchema";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    createPacijent: builder.mutation<Pacijent, CreatePacijentSchema>({
      query: (data) => ({
        url: "pacijenti",
        method: "POST",
        body: data, // sada šalješ JSON
      }),
    }),
    updatePacijent: builder.mutation<
      void,
      { id: number; data: CreatePacijentSchema }
    >({
      query: ({ id, data }) => ({
        url: `pacijenti`,
        method: "PUT",
        body: { id, ...data }, // JSON
      }),
    }),
    deletePacijent: builder.mutation<void, number>({
      query: (id) => ({
        url: `pacijenti/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePacijentMutation,
  useDeletePacijentMutation,
  useUpdatePacijentMutation,
} = adminApi;
