export type KrvnaGrupa = {
  id: number;
  pacijentId: number;
  grupa: "A" | "B" | "AB" | "O";
  faktor: "+" | "-";
};
