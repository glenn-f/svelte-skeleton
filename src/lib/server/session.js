import { randomBytes } from 'node:crypto'
import { apagarSessaoDB, apagarSessoesExpiradasDB, buscarSessaoDB, criarSessaoDB, limparSessoesUsuarioDB, verificarCredenciaisUsuario } from './db'
import { dev } from '$app/environment'

export const sessionCookieSettings = {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: !dev,
}
/** Tempo inicial em **milissegundos** de uma sessão de usuário na aplicação. */
export const tempoSessaoMS = 60 * (60 * 1000)
let proximaLimpezaSessoes = Date.now() + (tempoSessaoMS / 2)
const cacheSessoes = new Map()

/** Função de limpeza do cache em memória das sessões de usuário e do banco de dados */
function limparSessoes() {
  const now = Date.now()
  // Limpar cache
  for (const [sid, sessao] of cacheSessoes) { if (sessao.expiracao < now) { cacheSessoes.delete(sid) } }
  // Limpar banco de dados
  apagarSessoesExpiradasDB(now)
  // Definir próxima limpeza
  proximaLimpezaSessoes = Date.now() + (tempoSessaoMS / 2)
}

/**
 * Cria a sessão de um usuário, salvando-a no banco de dados e em memória da aplicação.
 * @param {number} uid ID do usuário no banco de dados
 * @param {object} usuarioDados Dados do usuário que serão mesclados com os dados da sessão
 * @returns {Sessao} Sessão do usuário
 */
export function criarSessao(uid) {
  let sid = '', sessao
  const expiracao = Date.now() + tempoSessaoMS

  // Criar e salvar sessão em BD
  for (let i = 0; i < 1 && !sessao; i++) {
    do { sid = randomBytes(32).toString('hex') } while (cacheSessoes.has(sid))
    criarSessaoDB(sid, expiracao, uid)
    sessao = buscarSessaoDB(sid)
  }
  if (!sessao) {
    console.log("Não foi possível criar a sessão!")
    return undefined
  }

  // Salvar sessão em memória
  cacheSessoes.set(sid, sessao)

  // Verificar limpeza do cache de sessões
  if (Date.now() > proximaLimpezaSessoes) { setTimeout(limparSessoes, 5000) }

  return sessao
}

/**
 * Performa o login do usuário, verificando as credenciais e criando uma sessão.
 * @param {string} email E-mail recebido do formulário de login
 * @param {string} senha Senha recebida do formulário de login
 * @returns {Sessao | undefined} Sessão do usuário ou vazio
 */
export async function efetuarLogin(email, senha) {
  const usuario = await verificarCredenciaisUsuario(email, senha)
  
  // Usuário válido: devolver sessão com dados do usuário
  if (usuario) return criarSessao(usuario.id)

  // Usuário inválido: retornar
  return undefined
}

export function resetarSessoesUsuario(uid) {
  const sessoes = limparSessoesUsuarioDB(uid)
  apagarSessoes(sessoes)
  return criarSessao(uid)
}

function apagarSessoes(sessoes) {
  if (Array.isArray(sessoes)) {
    for (let i = 0; i < sessoes.length; i++) {
      const sid = sessoes[i];
      cacheSessoes.delete(sid)
    }
  } else if (typeof sessoes == 'string') {
    cacheSessoes.delete(sessoes)
  }
}

/**
 * Busca a sessão no cache de memória, se não encontrar, busca no banco.
 * Por fim, retorna a sessão, se for encontrada.
 * @param {string} sid Chave da sessão do usuário que deve ser recebida via cookie
 * @returns {Sessao | undefined} Sessão do usuário
 */
export function buscarSessao(sid) {
  const sessaoCacheada = cacheSessoes.has(sid)
  const sessao = sessaoCacheada ? cacheSessoes.get(sid) : buscarSessaoDB(sid)
  const sessaoValida = sessao && (sessao.expiracao > Date.now())
  // Salvar e devolver sessao válida
  if (sessaoValida) {
    if (!sessaoCacheada) { cacheSessoes.set(sid, sessao) }
    return sessao
  }
  // Apagar sessão inválida e retornar
  if (sessao) apagarSessao(sessao.sid)
  return undefined
}

/**
 * Apaga a sessão do usuário no banco de dados e no cache de memória.
 * @param {string} sid Chave da sessão do usuário que deve ser recebida via cookie
 */
export function apagarSessao(sid) {
  if (sid) {
    cacheSessoes.delete(sid)
    apagarSessaoDB(sid)
  }
}

//* Definição de Tipos JSDoc

/**
 * @typedef {Object} SessaoDB
 * @property {string} sid
 * @property {number} uid
 * @property {number} expiracao
 */

/**
 * @typedef {Object} UsuarioSessao
 * @property {string} email
 * @property {string} nome
 */

/**
 * @typedef {SessaoDB | UsuarioSessao} Sessao
 */