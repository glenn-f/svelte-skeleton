import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{eid: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<GrupoPermissaoEmpresa>} Lista de usuários pertencentes à empresa 
 */
export function consultarGPEs(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT * FROM grupo_permissao_empresa WHERE empresa_id = $eid")
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharGPE(dados) {

}

export function editarGPE(dados) {

}

export function alternarStatusGPE(dados) {

}

/**
 * @typedef {Object} GrupoPermissaoEmpresa
 * @property {number} id - O ID do Grupo de Permissão
 * @property {number} empresa_id - O ID da Empresa
 * @property {string} nome - O nome do grupo de permissão
 * @property {boolean} pode_iniciar_venda - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_ver_estoque_disponivel - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_ver_historico_vendas - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_ver_estoque - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_entrada_estoque - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_saida_estoque - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_ver_saldo - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_transacao_receita - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_transacao_despesa - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_cadastrar_produto - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_cadastrar_pessoa - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_cadastrar_conta - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} pode_cadastrar_usuario - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} menu_venda - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} menu_estoque - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} menu_transacoes - Permissão para iniciar venda (Módulo de Venda)
 * @property {boolean} menu_cadastro - Permissão para iniciar venda (Módulo de Venda)
 * @property {Date} criacao - Data de inserção deste registro no banco de dados
 * @property {Date} [delecao] - Data de desativação deste registro no banco de dados
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/