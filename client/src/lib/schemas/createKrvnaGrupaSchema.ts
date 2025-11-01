import z from "zod";

// DTO za kreiranje ili update krvne grupe
export const createKrvnaGrupaSchema = z.object({
  grupa: z
    .string()
    .nonempty("Krvna grupa je obavezna.")
    .refine((val) => ["A", "B", "AB", "O"].includes(val), {
      message: "Krvna grupa mora biti A, B, AB ili O.",
    }),

  faktor: z
    .string()
    .nonempty("Faktor je obavezan.")
    .refine((val) => ["+", "-"].includes(val), {
      message: "Faktor mora biti + ili -.",
    }),
});

export type CreateKrvnaGrupaSchema = z.infer<typeof createKrvnaGrupaSchema>;
