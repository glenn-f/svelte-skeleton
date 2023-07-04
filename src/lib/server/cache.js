import { db } from './db'

//! Empresa

export const cacheEmpresa = new Map()

export function buscarEmpresa(id) {
  if (!id) return undefined
  if (cacheEmpresa.has(id)) {
    return cacheEmpresa.get(id)
  } else {
    return atualizarEmpresa(id)
  }
}

export function atualizarEmpresa(id) {
  const empresa = dbGetEmpresa(id)
  if (empresa) {
    cacheEmpresa.set(id, empresa)
    return empresa
  }
  return undefined
}

export function resetarEmpresa(id) {
  cacheEmpresa.delete(id)
  return atualizarEmpresa(id)
}

function dbGetEmpresa(id) {
  const query = db.prepare("SELECT * FROM empresa WHERE id = $id AND delecao IS NULL")
  return query.get({ id })
}

//! Grupo de Permissão de Empresa

export const cacheGPE = new Map()

function dbGetGPE(id) {
  const query = db.prepare("SELECT * FROM grupo_permissao_empresa WHERE id = $id AND delecao IS NULL")
  return query.get({ id })
}

function dbInsertGPE(gpe) {
  const query = db.prepare("INSERT INTO grupo_permissao_empresa (empresa_id,nome,pode_iniciar_venda,pode_ver_estoque_disponivel,pode_ver_historico_vendas,pode_ver_estoque,pode_entrada_estoque,pode_saida_estoque,pode_ver_saldo,pode_transacao_receita,pode_transacao_despesa,pode_cadastrar_produto,pode_cadastrar_pessoa,pode_cadastrar_conta,pode_cadastrar_usuario) \
VALUES ( $empresa_id, $nome, $pode_iniciar_venda, $pode_ver_estoque_disponivel, $pode_ver_historico_vendas, $pode_ver_estoque, $pode_entrada_estoque, $pode_saida_estoque, $pode_ver_saldo, $pode_transacao_receita, $pode_transacao_despesa, $pode_cadastrar_produto, $pode_cadastrar_pessoa, $pode_cadastrar_conta, $pode_cadastrar_usuario)")
  const res = query.run(gpe)
  if (res.chages > 0) {
    return res.lastInsertRowid
  }
  return undefined
}

function dbToggleGPE(id) {
  const query = db.prepare("SELECT delecao FROM grupo_permissao_empresa WHERE id =  $id")
  const status = query.pluck().get({ id })

}

export function criarGPE(gpe) {
  const { id, delecao, criacao, ...dados } = gpe
  const gpe_id = dbInsertGPE(dados)
  if (gpe_id) {
    const gpe = atualizarGPE(gpe_id)
    return gpe
  }
}

export function atualizarGPE(id) {
  const gpe = dbGetGPE(id)
  if (gpe) {
    cacheGPE.set(id, gpe)
    return gpe
  }
  return undefined
}

export function buscarGPE(id) {
  if (!id) return undefined
  if (cacheGPE.has(id)) {
    return cacheGPE.get(id)
  } else {
    return atualizarGPE(id)
  }
}

export function resetarGPE(id) {
  cacheGPE.delete(id)
  return atualizarGPE(id)
}