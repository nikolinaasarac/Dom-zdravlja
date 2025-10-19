import z from "zod";

export const createPacijentSchema = z.object({
  ime: z
    .string()
    .nonempty("Ime je obavezno.")
    .max(50, "Ime može imati najviše 50 karaktera."),

  prezime: z
    .string()
    .nonempty("Prezime je obavezno.")
    .max(50, "Prezime može imati najviše 50 karaktera."),

datumRodjenja: z
  .string()
  .nonempty("Datum rođenja je obavezan.")
  .refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d <= new Date();
  }, "Datum rođenja ne može biti u budućnosti."),


  pol: z
    .string()
    .nonempty("Pol je obavezan.")
    .max(20, "Pol može imati najviše 20 karaktera."),

  adresa: z
    .string()
    .nonempty("Adresa je obavezna.")
    .min(5, "Adresa mora imati najmanje 5 karaktera."),

  telefon: z
    .string()
    .nonempty("Broj telefona je obavezan.")
    .regex(/^\+?\d{6,15}$/, "Broj telefona mora biti ispravan (6–15 cifara, opcionalno s +)."),

  maticniBroj: z
    .string()
    .nonempty("Matični broj je obavezan.")
    .regex(/^\d{13}$/, "Matični broj mora sadržati tačno 13 cifara."),
});

export type CreatePacijentSchema = z.infer<typeof createPacijentSchema>;
