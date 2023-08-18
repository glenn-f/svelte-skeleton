import { z, zContabil, zID, zOptional, zTString } from "..";

export const criarContabilSchema = z.object({
  tipo_fc: zID,
  valor: zContabil,
  observacoes: zOptional(zTString),
})