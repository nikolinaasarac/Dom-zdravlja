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
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: "custom", // umesto ZodIssueCode.custom
          message: "Datum rođenja je obavezan.",
        });
        return;
      }

      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Datum rođenja nije validan.",
        });
        return;
      }

      if (date > new Date()) {
        ctx.addIssue({
          code: "custom",
          message: "Datum rođenja ne može biti u budućnosti.",
        });
      }
    }),

  pol: z
    .enum(["Muški", "Ženski"], { message: "Izaberite pol." }),

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
