import { db, dbInsert, dbSelectAll, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

export function definirMenus(gpe) {
  gpe.menu_loja = (gpe.pode_iniciar_venda + gpe.pode_ver_estoque_disponivel + gpe.pode_ver_historico_vendas) / 3
  gpe.menu_estoque = (gpe.pode_ver_estoque + gpe.pode_entrada_estoque + gpe.pode_saida_estoque) / 3
  gpe.menu_transacoes = (gpe.pode_ver_saldo + gpe.pode_transacao_despesa + gpe.pode_transacao_receita) / 3
  gpe.menu_cadastros = (gpe.pode_cadastrar_conta + gpe.pode_cadastrar_pessoa + gpe.pode_cadastrar_produto + gpe.pode_cadastrar_usuario) / 4
  return gpe
}

//! Usuarios.Grupos
/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<GrupoPermissaoEmpresa>} Lista de usuários pertencentes à empresa 
 */
export function consultarGPEs(dados, config = { apenasAtivos: false }) {
  const { empresa_id } = dados
  try {
    const delecao = config.apenasAtivos ? null : undefined
    const gpes = dbSelectAll('grupo_permissao_empresa', ['*'], { empresa_id, delecao })
    gpes.forEach(definirMenus)
    return { valid: true, data: gpes }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/**
 * Cria um grupo de grupo no banco de dados, retornando o ID criado ou os erros emitidos
 * @param {GPECreate} dados Dados do grupo para criação de registro
 * @returns {DBRun<GPECreate>} Resultado da criação do grupo
 */
export function criarGPE(dados) {
  try {
    const rs = dbInsert('grupo_permissao_empresa', dados)
    if (rs.changes > 0) {
      return { valid: true, data: rs.lastInsertRowid }
    } else {
      return { valid: false, message: "Erro desconhecido", code: "DB_UNKNOWN" }
    }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro no servidor", code: "DB_UNKNOWN" }
  }
}

/**
 * Atualiza os dados de um grupo no banco de dados, retornando válido ou os erros emitidos
 * @param {GPEUpdate} dados Dados do grupo para atualização
 * @returns {DBRun<GPEUpdate>} Resultado da atualização do grupo
 */
export function editarGPE(dados) {
  const { id, ...campos } = dados
  try {
    const { changes } = dbUpdate('grupo_permissao_empresa', campos, { id })
    if (changes > 0) {
      return { valid: true, data: null }
    } else {
      return { valid: false, message: "Nenhum grupo foi atualizado", code: "DB_UNKNOWN" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, message: 'Houve problemas em alguns campos', fieldMessage: { nome: ['Este nome já está em uso'] } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

/**
 * Alterna o status do grupo (ativar ou desativar) a partir do seu ID.
 * @param {{id: number}} dados ID do usuário a ser alternado
 * @returns {DBSoftDelete<{id: number}>} Resultado da alteração de status
 */
export function alternarStatusGPE(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('grupo_permissao_empresa', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const gpe = dbSelectOne('grupo_permissao_empresa', ['delecao'], { id })
    if (gpe?.delecao) {
      return { valid: true, data: "Grupo desativado com sucesso" }
    } else {
      return { valid: true, data: "Grupo ativado com sucesso" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    return { ok: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

//TODO export function detalharGPE(dados) {}


//! Empresa.Criar
/**
 * Cria os três grupos de usuário iniciais com as permissões pré-definidas e retorna o ID da direção
 * @param {number} empresa_id ID da empresa
 * @returns {number | undefined} ID do grupo de permissão mais alto (Direção)
 */
export function criarGPEInicial(empresa_id) {
  try {
    const query = db.prepare("INSERT OR IGNORE INTO grupo_permissao_empresa (empresa_id,nome,pode_iniciar_venda,pode_ver_estoque_disponivel,pode_ver_historico_vendas,pode_ver_estoque,pode_entrada_estoque,pode_saida_estoque,pode_ver_saldo,pode_transacao_receita,pode_transacao_despesa,pode_cadastrar_produto,pode_cadastrar_pessoa,pode_cadastrar_conta,pode_cadastrar_usuario)\
VALUES ( $empresa_id ,'Básico',1,1,1,1,0,0,0,0,0,0,0,0,0),( $empresa_id ,'Gerência',1,1,1,1,1,1,0,0,1,1,1,0,0),( $empresa_id ,'Direção',1,1,1,1,1,1,1,1,1,1,1,1,1)")
    const res = query.run({ empresa_id })
    const select = db.prepare("SELECT id FROM grupo_permissao_empresa g WHERE g.nome = 'Direção' AND g.empresa_id = $empresa_id")
    const direcao_id = select.pluck().get({ empresa_id })
    return direcao_id
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return undefined
  }
}

//! JSDocs
/**
 * @typedef {Object} GrupoPermissaoEmpresa
 * @property {number} id O ID do Grupo de Permissão
 * @property {number} empresa_id O ID da Empresa
 * @property {number} criador_id O ID da Usuário criador
 * @property {string} nome O nome do grupo de permissão
 * @property {boolean|number} pode_iniciar_venda 
 * @property {boolean|number} pode_ver_estoque_disponivel 
 * @property {boolean|number} pode_ver_historico_vendas 
 * @property {boolean|number} pode_ver_estoque
 * @property {boolean|number} pode_entrada_estoque
 * @property {boolean|number} pode_saida_estoque
 * @property {boolean|number} pode_ver_saldo
 * @property {boolean|number} pode_transacao_receita
 * @property {boolean|number} pode_transacao_despesa
 * @property {boolean|number} pode_cadastrar_produto
 * @property {boolean|number} pode_cadastrar_pessoa
 * @property {boolean|number} pode_cadastrar_conta
 * @property {boolean|number} pode_cadastrar_usuario
 * @property {boolean|number} menu_venda
 * @property {boolean|number} menu_estoque
 * @property {boolean|number} menu_transacoes
 * @property {boolean|number} menu_cadastro
 * @property {number} criacao Data de inserção deste registro no banco de dados
 * @property {number} [alteracao] Data de inserção deste registro no banco de dados
 * @property {number} [delecao] Data de desativação deste registro no banco de dados
 */


/**
 * @typedef {Object} GPECreate
 * @property {number} empresa_id O ID da Empresa
 * @property {number} criador_id O ID da Usuário criador
 * @property {string} nome O nome do usuário
 * @property {boolean|number} pode_iniciar_venda 
 * @property {boolean|number} pode_ver_estoque_disponivel 
 * @property {boolean|number} pode_ver_historico_vendas 
 * @property {boolean|number} pode_ver_estoque
 * @property {boolean|number} pode_entrada_estoque
 * @property {boolean|number} pode_saida_estoque
 * @property {boolean|number} pode_ver_saldo
 * @property {boolean|number} pode_transacao_receita
 * @property {boolean|number} pode_transacao_despesa
 * @property {boolean|number} pode_cadastrar_produto
 * @property {boolean|number} pode_cadastrar_pessoa
 * @property {boolean|number} pode_cadastrar_conta
 * @property {boolean|number} pode_cadastrar_usuario
 */

/**
 * @typedef {Object} GPEUpdate
 * @property {number} id ID do Grupo de Permissão
 * @property {string} nome O nome do Grupo de Permissão
 * @property {boolean|number} pode_iniciar_venda 
 * @property {boolean|number} pode_ver_estoque_disponivel 
 * @property {boolean|number} pode_ver_historico_vendas 
 * @property {boolean|number} pode_ver_estoque
 * @property {boolean|number} pode_entrada_estoque
 * @property {boolean|number} pode_saida_estoque
 * @property {boolean|number} pode_ver_saldo
 * @property {boolean|number} pode_transacao_receita
 * @property {boolean|number} pode_transacao_despesa
 * @property {boolean|number} pode_cadastrar_produto
 * @property {boolean|number} pode_cadastrar_pessoa
 * @property {boolean|number} pode_cadastrar_conta
 * @property {boolean|number} pode_cadastrar_usuario
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/

/**
  * @template T
  * @typedef {import('..').DBGet<T>} DBGet<T>
*/

/**
  * @template T
  * @typedef {import('..').DBRun<T>} DBRun<T>
*/

/**
  * @template T
  * @typedef {import('..').DBSoftDelete<T>} DBSoftDelete<T>
*/