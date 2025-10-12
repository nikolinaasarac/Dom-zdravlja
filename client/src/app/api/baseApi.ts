import {
  fetchBaseQuery,
  type FetchBaseQueryError,
  type FetchArgs,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { getAccessToken, setAccessToken } from "../../features/Login/tokenStore";
import { logout } from "../../features/Login/authSlice";
import { Mutex } from "async-mutex";

// 🔒 Mutex sprečava više paralelnih refresh poziva
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  await mutex.waitForUnlock(); // čeka ako refresh već traje

  let result = await baseQuery(args, api, extraOptions);
  console.log("Prije provjere refresh")
  //console.log(result.error +" "+ (result.error as FetchBaseQueryError).status)

  console.log("Result:", result);
if (result.error) {
    console.log("Error type:",  result.error);
    console.log("Error status:", (result.error as FetchBaseQueryError).status);
    console.log("Error data:", (result.error as FetchBaseQueryError).data);
}


  // 🧠 Ako dobijemo 401 (unauthorized), pokušaj refresh tokena
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    console.log("Poslije refresa")
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        console.log("trazi novi access");
        const refreshResult = await baseQuery(
            { url: "login/refresh-token", method: "POST"},
          api,
          extraOptions
        );

        if (
          refreshResult.data &&
          typeof refreshResult.data === "object" &&
          "accessToken" in refreshResult.data
        ) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          setAccessToken(accessToken); // ✅ ispravno — čuvamo token u runtime-u
          console.log("Novi token: " + accessToken);

          // 🔁 ponovi originalni zahtjev
          result = await baseQuery(args, api, extraOptions);
        } else {
          // ❌ Refresh nije uspio — odjava korisnika
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Ako je refresh već u toku, čekamo da završi
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
