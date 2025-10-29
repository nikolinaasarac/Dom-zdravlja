import z from "zod";

export const createKorisnikSchema = z
  .object({
    username: z
      .string()
      .nonempty("Korisničko ime je obavezno")
      .max(50, "Maksimalno 50 karaktera"),
    password: z
      .string()
      .nonempty("Lozinka je obavezna")
      .min(6, "Lozinka mora imati najmanje 6 karaktera"),
    role: z.enum(["Admin", "Doktor", "Pacijent", "Tehni"], {
      message: "Izaberite rolu",
    }),
    doktorId: z.number().optional().nullable(),
    pacijentId: z.number().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Doktor" && !data.doktorId) {
      ctx.addIssue({
        code: "custom",
        path: ["doktorId"],
        message: "Morate izabrati doktora",
      });
    }
    if (data.role === "Pacijent" && !data.pacijentId) {
      ctx.addIssue({
        code: "custom",
        path: ["pacijentId"],
        message: "Morate izabrati pacijenta",
      });
    }
  });

export type CreateKorisnikSchema = z.infer<typeof createKorisnikSchema>;
