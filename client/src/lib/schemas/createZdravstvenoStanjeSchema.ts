import z from "zod";

export const createZdravstvenoStanjeSchema = z.object({
  naziv: z
    .string()
    .nonempty("Naziv je obavezan.")
    .max(100, "Naziv može imati najviše 100 karaktera."),

  tip: z.enum(["Bolest", "Alergija"], {
    message: "Tip mora biti 'Bolest' ili 'Alergija'.",
  }),

  datumDijagnoze: z
    .string()
    .nonempty("Datum dijagnoze je obavezan.")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Datum dijagnoze nije validan.",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Datum dijagnoze ne može biti u budućnosti.",
    }),

  napomena: z
    .string()
    .max(500, "Napomena može imati najviše 500 karaktera.")
    .optional(),
});

export type CreateZdravstvenoStanjeSchema = z.infer<
  typeof createZdravstvenoStanjeSchema
>;
