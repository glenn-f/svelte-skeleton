import { dev } from '$app/environment'
import { USUARIO_ADMINISTRADOR, USUARIO_MEMBRO } from '$lib/globals'
import { apagarSessao, apagarSessoesExpiradas, detalharSessao, criarSessao, apagarSessoesUsuario } from './db/models/sessao'
import { verificarCredenciaisUsuario } from './db/models/usuario'
import { gerarRandomHex } from './encript'

/** Configuração de cookies para HTTP Headers */
export const sessionCookieSettings = {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: !dev,
}

/** Tempo inicial em **milissegundos** de uma sessão de usuário na aplicação. */
export const tempoSessaoMS = 8 * 60 * (60 * 1000)
export const tempoLimpezaSessaoMS = 1 * 60 * (60 * 1000)
let proximaLimpezaSessoes = Date.now() + tempoLimpezaSessaoMS
const cacheSessoes = new Map()

/** Função de limpeza do cache em memória das sessões de usuário e do banco de dados */
function limparSessoes() {
  const now = Date.now()
  for (const [sid, sessao] of cacheSessoes) { if (sessao.expiracao < now) { cacheSessoes.delete(sid) } }
  apagarSessoesExpiradas(now)
  proximaLimpezaSessoes = Date.now() + (tempoSessaoMS / 2)
}

/**
 * Cria a sessão de um usuário, salvando-a no banco de dados e em memória da aplicação.
 * @param {number} usuarioId ID do usuário no banco de dados
 * @returns {DBGet<SessaoUsuarioEmpresa>} Sessão do usuário
 */
export function criarSessaoUsuario(usuarioId) {
  let id = '', sessao
  const expiracao = Date.now() + tempoSessaoMS
  // Criar e salvar sessão em BD
  for (let i = 0; i < 5 && !sessao; i++) {
    do { id = gerarRandomHex(32) } while (cacheSessoes.has(id))
    const rs = criarSessao({ id, expiracao, usuarioId })
    if (rs) { sessao = detalharSessao({ id }) }
  }
  if (!sessao) {
    return { valid: false, message: "Não foi possível criar a sessão", code: "FAILED_SESSION" }
  }
  // Salvar sessão em memória
  cacheSessoes.set(id, sessao)
  // Atualizar limpeza do cache de sessões
  if (Date.now() > proximaLimpezaSessoes) { setTimeout(limparSessoes, 5000) }
  return { valid: true, data: sessao }
}

/**
 * Performa o login do usuário, verificando as credenciais e criando uma sessão.
 * @param {string} email E-mail recebido do formulário de login
 * @param {string} senha Senha recebida do formulário de login
 */
export async function efetuarLogin(email, senha) {
  const rs = await verificarCredenciaisUsuario({ email, senha })
  // Usuário válido: devolver sessão com dados do usuário
  if (rs.valid) {
    const uid = rs.data.id
    return criarSessaoUsuario(uid)
  }
  // Usuário inválido: retornar
  return rs
}

/**
 * Apaga todas as sessões do usuário (cache e DB) e gera uma nova sessão válida
 * @param {number} uid ID do usuário
 */
export function resetarSessoesUsuario(uid) {
  const sessoes = apagarSessoesUsuario(uid)
  apagarSessoesCache(sessoes)
  return criarSessaoUsuario(uid)
}

/**
 * Apaga todas as sessões do cache
 * @param {string[]} sessoes ID das sessões
 */
function apagarSessoesCache(sessoes) {
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
 * @returns {SessaoUsuarioEmpresa | undefined} Sessão do usuário
 */
export function buscarSessaoUsuario(sid) {
  const sessaoCacheada = cacheSessoes.has(sid)
  const sessao = sessaoCacheada ? cacheSessoes.get(sid) : detalharSessao(sid)
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
export function apagarSessaoUsuario(sid) {
  if (sid) {
    cacheSessoes.delete(sid)
    apagarSessao(sid)
  }
}

export function podeAcessar(rota, sessao) {
  const admin = sessao.perm == USUARIO_ADMINISTRADOR
  if (admin) return true
  const perms = { ...sessao.gpe, membro: sessao.perm == USUARIO_MEMBRO }
  rota = rota.slice(15).split("/")
  let pag = paginas
  for (let i = 0; i < rota.length; i++) {
    const r = rota[i];
    if (!(r in pag)) return true
    pag = pag[r]
    if (pag.$gpe === true || perms[pag.$gpe]) {
      pag = pag.$pages
      if (!pag) return true
      continue
    }
    return false
  }
  return true
}

const paginas = {
  loja: {
    $gpe: "menu_loja", $pages: {
      disponivel: { $gpe: "pode_ver_estoque_disponivel", $pages: { $all: true } },
      historico: { $gpe: "pode_ver_historico_vendas", $pages: { $all: true } },
      vender: { $gpe: "pode_iniciar_venda", $pages: { $all: true } },
    }
  },
  estoque: {
    $gpe: "menu_estoque", $pages: {
      inventario: { $gpe: "pode_ver_estoque", $pages: { ["[id]"]: { $gpe: "pode_entrada_estoque" } } },
      entradas: { $gpe: "pode_entrada_estoque", $pages: { $all: true } },
      saidas: { $gpe: "pode_saida_estoque", $pages: { $all: true } },
    }
  },
  transacoes: {
    $gpe: "menu_transacoes", $pages: {
      saldo: { $gpe: "pode_ver_saldo", $pages: { $all: true } },
      historico: { $gpe: "pode_transacao_despesa", $pages: { $all: true } },
    }
  },
  cadastros: {
    $gpe: "menu_cadastros", $pages: {
      usuarios: { $gpe: "pode_cadastrar_usuario", $pages: { $all: true } },
      contas: { $gpe: "pode_cadastrar_conta", $pages: { $all: true } },
      produtos: { $gpe: "pode_cadastrar_produto", $pages: { $all: true } },
      pessoas: { $gpe: "pode_cadastrar_pessoa", $pages: { $all: true } },
      tributos: { $gpe: "pode_cadastrar_conta", $pages: { $all: true } },
      comissao: { $gpe: "pode_cadastrar_conta", $pages: { $all: true } },
    }
  },
  perfil: {
    $gpe: true, $pages: {
      empresas: { $gpe: "membro", $pages: { $all: true } },
    }
  },
}

//* Definição de Tipos JSDoc
/**
 * @typedef {import('./db/models/sessao').SessaoUsuarioEmpresa} SessaoUsuarioEmpresa
 */
/**
  * @template T
  * @typedef {import('./db').DBGet<T>} DBGet<T>
*/