import { z } from "zod";

export const createTehnicarSchema = z.object({
  ime: z.string().min(1, "Ime je obavezno"),
  prezime: z.string().min(1, "Prezime je obavezno"),
  maticniBroj: z
    .string()
    .nonempty("Matični broj je obavezan.")
    .regex(/^\d{13}$/, "Matični broj mora sadržati tačno 13 cifara."),
  telefon: z.string().min(1, "Telefon je obavezan"),
  email: z.string().email("Neispravna email adresa"),
  adresa: z.string().min(1, "Adresa je obavezna"),
});

export type CreateTehnicarSchema = z.infer<typeof createTehnicarSchema>;
