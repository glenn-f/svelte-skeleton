import { db } from ".."

export function consultarUsuarios(dados) {
  //TODO consulta de contas no banco de dados
  const query = db.prepare("")
  const contas = query.all(dados)

  return contas
}