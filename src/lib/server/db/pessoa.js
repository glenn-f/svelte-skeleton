import { db } from ".";
import { z } from "../../zodBr";

//TODO Zod Schemas
export const pessoaSchema = z.object({
  id: z.coerce.number().int(),
  empresa_id: z.coerce.number().int(),
  criador_id: z.coerce.number().int(),
  tipo_pessoa: z.coerce.number().int(),
  nome: z.string().trim().min(5),
  email: z.string().trim(),
  cpf: z.string().trim(),
  cnpj: z.string().trim(),
  rg: z.string().trim(),
  apelido: z.string().trim(),
  endereco: z.string().trim(),
  cep: z.string().trim(),
  sexo: z.string().trim(),
  dn: z.coerce.date()

})

//TODO Database Actions (Queries & Mutations)
export function criarPessoa() {
  
}

export function listarPessoas() {

}

export function editarPessoa() {

}

export function statusPessoa() {

}