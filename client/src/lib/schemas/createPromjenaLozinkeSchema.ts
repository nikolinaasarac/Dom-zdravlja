import z from "zod";

export const promjenaLozinkeSchema = z
  .object({
    novaLozinka: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    potvrdiLozinku: z.string(),
  })
  .refine((data) => data.novaLozinka === data.potvrdiLozinku, {
    message: "Lozinke se ne poklapaju",
    path: ["potvrdiLozinku"],
  });

export type PromjenaLozinkeForm = z.infer<typeof promjenaLozinkeSchema>;
