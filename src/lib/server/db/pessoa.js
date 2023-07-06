import { db } from ".";
import { z } from "../../zodBr";

//TODO Zod Schemas
export const pessoaSchema = z.object({
  id: z.coerce.number().int(),
  empresa_id: z.coerce.number().int(),
  criador_id: z.coerce.number().int(),
  tipo_associacao: z.coerce.number().int(),
  tipo_pessoa: z.coerce.number().int(),
  nome: z.string().trim().min(5),
  email: z.string().trim().optional(),
  cpf: z.string().trim().optional(),
  cnpj: z.string().trim().optional(),
  rg: z.string().trim().optional(),
  apelido: z.string().trim().optional(),
  endereco: z.string().trim().optional(),
  cep: z.string().trim().optional(),
  sexo: z.string().trim().optional(),
  dn: z.coerce.date().optional(),
})

export const criarPessoaSchema = pessoaSchema.omit({ id: true, criador_id: true, empresa_id: true }).extend({

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