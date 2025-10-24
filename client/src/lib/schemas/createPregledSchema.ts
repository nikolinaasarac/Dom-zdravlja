import z from "zod";

export const createPregledInfoSchema = z.object({
    dijagnoza: z.string().min(3, "Dijagnoza mora imati barem 3 slova"),
    terapija: z.string().min(3, "Terapija mora imati barem 3 slova"),
    napomena: z.string().optional(),
});

export type CreatePregledInfoSchema = z.infer<typeof createPregledInfoSchema>;