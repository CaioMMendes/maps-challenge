import { z } from "zod";

export const inputSchema = z.object({
  start: z
    .string({ invalid_type_error: "O valor precisa ser uma string" })
    .trim()
    .max(200, "Você ultrapassou o limite de 200 caracteres"),
  end: z
    .string({ invalid_type_error: "O valor precisa ser uma string" })
    .trim()
    .max(200, "Você ultrapassou o limite de 200 caracteres"),
});
