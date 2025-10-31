import { z } from "zod";

export const createDoktorSchema = z.object({
  ime: z.string().min(1, "Ime je obavezno"),
  prezime: z.string().min(1, "Prezime je obavezno"),
  maticniBroj: z
    .string()
    .nonempty("Matični broj je obavezan.")
    .regex(/^\d{13}$/, "Matični broj mora sadržati tačno 13 cifara."),
  specijalizacija: z.string().min(1, "Specijalizacija je obavezna"),
  brojLicence: z.string().min(1, "Broj licence je obavezan"),
  telefon: z.string().min(1, "Telefon je obavezan"),
  email: z.string().email("Neispravna email adresa"),
  adresa: z.string().min(1, "Adresa je obavezna"),
});

export type CreateDoktorSchema = z.infer<typeof createDoktorSchema>;
