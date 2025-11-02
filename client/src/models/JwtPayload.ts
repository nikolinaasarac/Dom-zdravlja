export type JwtPayload = {
  userId: string;
  username: string;
  role: string;
  exp?: number; // opcionalno, vrijeme isteka tokena
};
