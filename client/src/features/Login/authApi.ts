import api from "./axiosClient";
import type { TokenResponseDto, UserDto } from "./types";

export const authApi = {
  register: (data: UserDto) => api.post("/login/register", data),
  login: (data: UserDto) => api.post<TokenResponseDto>("/login/login", data),
};
