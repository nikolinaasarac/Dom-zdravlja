import z from "zod";

export const createKorisnikSchema = z.object({
  username: z.string().min(3, "Korisničko ime mora imati bar 3 karaktera"),
  password: z.string().min(5, "Lozinka mora imati bar 5 karaktera"),
  role: z
    .enum(["Admin", "Doktor", "Pacijent", "Tehnicar"])
    .refine((val) => !!val, { message: "Odaberite ulogu" }),
  maticniBroj: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{13}$/.test(val), {
      message: "Matični broj mora imati 13 cifara",
    }),
});

export type CreateKorisnikSchema = z.infer<typeof createKorisnikSchema>;
