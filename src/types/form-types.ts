import { z } from "zod";

export const inputSchema = z.object({
  start: z
    .string({ invalid_type_error: "O valor precisa ser uma string" })
    .trim()
    // .min(1, "Você precisa escolher uma partida")
    .max(200, "Você ultrapassou o limite de 200 caracteres")
    .optional(),
  end: z
    .string({ invalid_type_error: "O valor precisa ser uma string" })
    .trim()
    .min(1, "Você precisa escolher um destino")
    .max(200, "Você ultrapassou o limite de 200 caracteres"),
});
