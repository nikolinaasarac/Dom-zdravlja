import z from "zod";

export const createZahtjevSchema = z.object({
 doktorId: z.string().nonempty("Morate izabrati doktora."),
  opis: z
    .string()
    .nonempty("Opis je obavezan.")
    .min(10, "Opis mora imati najmanje 10 karaktera.")
    .max(500, "Opis može imati najviše 500 karaktera."),
});

export type CreateZahtjevSchema = z.infer<typeof createZahtjevSchema>;
