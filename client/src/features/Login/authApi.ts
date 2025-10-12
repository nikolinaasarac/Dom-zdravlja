// src/features/Login/authApi.ts
import type { TokenResponseDto } from "./types";
import { customBaseQuery } from "../../app/api/baseApi";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react";

interface LoginCredentials {
  username: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ data: TokenResponseDto }> => {
    const result = await customBaseQuery(
      { url: "login/login", method: "POST", body: credentials } as FetchArgs,
      {} as BaseQueryApi,
      {}
    );

    if ("error" in result) {
      throw new Error("Login failed");
    }

    return { data: result.data as TokenResponseDto };
  },

  refresh: async (): Promise<{ data: TokenResponseDto }> => {
    const result = await customBaseQuery(
      { url: "login/refresh-token", method: "POST" } as FetchArgs,
      {} as BaseQueryApi,
      {}
    );

    if ("error" in result) {
      throw new Error("Refresh failed");
    }

    return { data: result.data as TokenResponseDto };
  },
};
