import { FE_VENDA } from '$lib/globals'
import { db, dbInsert, dbSelectOne, dbUpdate } from '..'

const estoque_saida = {
  tipo_fe: FE_VENDA,
  id: 1,
  qntd: 1,
  valor: 1700,
}
const { id, qntd } = estoque_saida

// const data = dbSelectOne('estoque', ['*'], { id: estoque_saida.id })
const insert = db.prepare("SELECT qntd, (qntd - $qntd) qntd_res, custo, (custo * (1 - ($qntd / qntd))) rest  FROM estoque WHERE id = $id").get({ id, qntd })

console.log(insert)


// {
//   id: 1,
//   produto_id: 3,
//   qntd: 5,
//   custo: 42744600,
//   preco_unitario: 21000000,
//   estado: 1,
//   condicao: 1,
//   origem: 3,
//   codigo: null,
//   dados_json: null,
//   observacoes: 'desconto da zona franca',
//   criacao: 1691713016000,
//   alteracao: null,
//   delecao: null,
//   criador_id: 0
// }