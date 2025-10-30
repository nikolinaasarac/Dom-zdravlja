import z from "zod";

export const createZahtjevAnalizuSchema = z.object({
  opis: z.string().nonempty("Opis je obavezan."),
});

export type CreateZahtjevAnalizuSchema = z.infer<typeof createZahtjevAnalizuSchema>;
