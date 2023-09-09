import { DateTime } from "luxon";
import { ERRO_CAMPOS, ERRO_SERVIDOR, FE_BUYBACK, isReceita, isSaidaEstoque, mapCausasErro, mapFluxoContabil, mapProcessoEstoque } from "./globals";

export function isIterable(value) {
  return typeof value == 'object' && typeof value[Symbol.iterator] === 'function';
}

export function objectToArray(obj) {
  if (obj instanceof Array) {
    return obj.map((value, index) => [index, value])
  } else if (isIterable(obj)) {
    return Array.from(obj)
  } else if (typeof obj == 'object') {
    return Object.entries(obj)
  }
  return obj
}

export function capitalizeFirst(str) {
  if (typeof str !== 'string') return ''
  let tmp = "";
  let notFirst = 0;
  for (const c of str) {
    tmp += notFirst ? c.toLowerCase() : c.toUpperCase();
    notFirst = /[^a-zA-Z]/.test(c) ? 0 : notFirst + 1
  }
  return tmp;
}

export function resumirProcesso(dados) {
  let { id: pid, tipo_pe, responsavel: vendedor, participante: cliente, criacao: data_venda, fe, ff: transacoes, fc } = dados
  let receitas = fc.filter(v => isReceita(v.tipo_fc))
  let buybacks = fe.filter(v => v.tipo_fe === FE_BUYBACK)
  let nomeProcesso = mapProcessoEstoque.get(tipo_pe)
  const totalBuyback = buybacks.reduce((acc, v) => acc + v.var_custo, 0) || 0
  const totalTransacoes = transacoes.reduce((acc, v) => acc + v.valor, 0) || 0
  let totalReceitas = 0
  const estoques = new Map()
  fe?.forEach((v) => estoques.set(v.estoque_id, { ...v, custos: [], receitas: [] }))
  receitas.forEach((v) => { estoques.get(v.estoque_id)?.receitas.push({ valor: v.valor, tipo_fc: v.tipo_fc }); totalReceitas += v.valor })
  data_venda = DateTime.fromMillis(data_venda).toFormat("dd/LL/yy HH:mm")
  let textoEstoques = `💥 ${nomeProcesso} ${data_venda} (PID: ${pid})\n`
  estoques.forEach((v, k) => {
    if (!isSaidaEstoque(v.tipo_fe)) return
    textoEstoques += `${v.produto} (EID: ${v.estoque_id})\n`
    textoEstoques += `Código: ${v.codigo ?? '-'}\n`
    textoEstoques += `Receitas: `
    v.receitas.forEach(v => textoEstoques += `${formatMoeda(v.valor)} (${mapFluxoContabil.get(v.tipo_fc)})\n`)
  })
  textoEstoques += `⬆️ Vendas Total: ${formatMoeda(totalReceitas)}\n`

  if (buybacks.length > 0) textoEstoques += `\n⬇️Buybacks Total: ${formatMoeda(totalBuyback)}\n`
  buybacks.forEach((v) => {
    textoEstoques += `${v.produto} (EID: ${v.estoque_id})\n`
    textoEstoques += `Código: ${v.codigo ?? '-'}\n`
    textoEstoques += `Custo: ${formatMoeda(v.var_custo)}\n`
  })

  if (transacoes.length > 0) textoEstoques += `\n⬇️Transações Total: ${formatMoeda(totalTransacoes)}\n`

  transacoes.forEach((v) => {
    textoEstoques += `${formatMoeda(v.valor)} (${v.conta_forma}${v.parcela ? ` ${v.parcela}x` : ''})\n`
  })
  vendedor = vendedor ? vendedor + ' 😎' : undefined
  cliente = cliente ? cliente + ' 😃' : undefined
  textoEstoques += `\n`
  textoEstoques += `Cliente: ${cliente ?? '-'}\n`
  textoEstoques += `Vendedor: ${vendedor ?? '-'}\n`

  return textoEstoques
}

/**
 * 
 * @param {number} dataMillis Data em milissegundos unix timestamp
 * @returns {number} Horas em valor absoluto (>= 0)
 */
export function diferencaEmHoras(dataMillis) {
  const dataAntiga = DateTime.fromMillis(dataMillis)
  const dataAtual = DateTime.now()
  const diferencaEmHoras = dataAntiga.diff(dataAtual, 'hours').hours

  return Math.abs(diferencaEmHoras)
}

export function isSvelteStore(obj) {
  return (typeof obj == 'object' && obj !== null && typeof obj.subscribe === 'function')
}
export function formatCNPJ(value) {
  if (!value) return ''
  const cnpj = toNumericText(value, 14)
  const regex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/
  const mask = '$1.$2.$3/$4-$5'
  return cnpj.replace(regex, mask)
}

export function formatDateTime(date) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

export function formatCPF(value) {
  if (!value) return ''
  const cpf = toNumericText(value, 11)
  const regex = /^(\d{3})(\d{3})(\d{3})(\d{2}).*/
  const mask = '$1.$2.$3-$4'
  return cpf.replace(regex, mask)
}

/**
 * Transforma um número em texto no formato moeda BRL sem prefixo
 * @param {number} value Número que representa o valor monetário
 * @returns {string} Texto no formato moeda (BRL)
 */
export function formatMoeda(value, qntdAposVirgula = 2) {
  const numberValue = parseFloat(value)
  let options = qntdAposVirgula == undefined ? {} : { minimumFractionDigits: qntdAposVirgula, maximumFractionDigits: qntdAposVirgula }
  if (Number.isFinite(numberValue)) {
    return numberValue.toLocaleString('pt-BR', options)
  } else {
    // throw new TypeError("O valor não é um número válido")
    return value?.toString() ?? ''
  }
}

export function formatInteger(value) {
  const numberValue = parseInt(value)
  if (!Number.isInteger(numberValue)) return ''
  return numberValue.toLocaleString('pt-BR'/* ,{ minimumFractionDigits: 0, maximumFractionDigits: 0 } */)
}

export function roundBy(value, by = 0) {
  by = 10 ** by
  return Math.round(value * by) / by
}

export function formatTaxa(value, qntdAposVirgula = 2) {
  const numberValue = parseFloat(value) * 100
  let options = qntdAposVirgula == undefined ? {} : { minimumFractionDigits: qntdAposVirgula, maximumFractionDigits: qntdAposVirgula }
  if (Number.isFinite(numberValue)) {
    return numberValue.toLocaleString('pt-BR', options)
  } else {
    // throw new TypeError("O valor não é um número válido")
    return ''
  }
}

export function toNumericText(value, size, padChar = '0') {
  return value.toString().replace(/\D/g, '').padStart(size, padChar).slice(0, size)
}

export function log(data) {
  console.log(' LOG >>', DateTime.now().toFormat('HH:mm:ss'), JSON.stringify(data, null, 1))
}

/**
 * @param {ErrorDescription} descriptor 
 * @returns {Partial<HandledError>} 
 */
function handleSqliteError(descriptor) {
  const errorCode = descriptor.error.code
  let msg = 'Erro no banco de dados'
  if (errorCode == 'SQLITE_CONSTRAINT_UNIQUE' || errorCode == 'SQLITE_CONSTRAINT_PRIMARYKEY') {
    msg = 'Já está em uso'
  } else if (errorCode == 'UNKNOWN_SQLITE_ERROR_3091' || errorCode == 'SQLITE_CONSTRAINT_DATATYPE') {
    msg = 'Formato incorreto'
  } else if (errorCode == 'SQLITE_CONSTRAINT_NOTNULL') {
    msg = 'Campo obrigatório'
  }
  if (!msg) {
    console.log('Code: ', errorCode)
    console.log(descriptor.error.stack)
  } else {
    console.log(descriptor.errorType, "→", errorCode)
    console.log("Mensagem do erro:", descriptor.error.message)
  }

  const regexMatch = descriptor.message.match(/([\w]+)\.([\w]+)$/)
  const tableColumn = regexMatch ? { table: regexMatch[1], column: regexMatch[2] } : null
  const fieldErrors = tableColumn ? { [tableColumn.column]: [msg] } : false
  const cause = fieldErrors ? ERRO_CAMPOS : ERRO_SERVIDOR
  const message = mapCausasErro.get(cause)

  return { message, cause, fieldErrors, errorCode }
  // const sqliteErrorCodes = ["SQLITE_ABORT", "SQLITE_AUTH", "SQLITE_BUSY", "SQLITE_CANTOPEN", "SQLITE_CONSTRAINT", "SQLITE_CORRUPT", "SQLITE_EMPTY", "SQLITE_ERROR",
  // "SQLITE_FORMAT", "SQLITE_FULL", "SQLITE_INTERNAL", "SQLITE_INTERRUPT", "SQLITE_IOERR", "SQLITE_LOCKED", "SQLITE_MISMATCH", "SQLITE_MISUSE", "SQLITE_NOLFS", "SQLITE_NOMEM",
  // "SQLITE_NOTADB", "SQLITE_NOTFOUND", "SQLITE_NOTICE", "SQLITE_PERM", "SQLITE_PROTOCOL", "SQLITE_RANGE", "SQLITE_READONLY", "SQLITE_SCHEMA", "SQLITE_TOOBIG", "SQLITE_WARNING"]
  //? SqliteError: FOREIGN KEY constraint failed // code: 'SQLITE_CONSTRAINT_FOREIGNKEY'
  //TODO SqliteError: UNIQUE constraint failed: usuario.email // code: 'SQLITE_CONSTRAINT_UNIQUE'
  //TODO SqliteError: cannot store TEXT value in INTEGER column usuario.tipo_usuario // code: 'UNKNOWN_SQLITE_ERROR_3091' SQLITE_CONSTRAINT_DATATYPE (3091)
  //TODO SqliteError: NOT NULL constraint failed: usuario.senha // code: 'SQLITE_CONSTRAINT_NOTNULL'
  //TODO SqliteError: UNIQUE constraint failed: usuario.id // code: 'SQLITE_CONSTRAINT_PRIMARYKEY'
}
/**
 * Trata um erro emitido definindo a mensagem, a causa, os campos geradores (se houver) e o tipo do Erro, além de efeitos colaterais para erros conhecidos
 * @param {*} error Erro emitido
 * @returns {HandledError} Descrição do erro tratado
 */
export function handleAnyError(error) {
  const desc = describeError(error)
  let res = { message: mapCausasErro.get(ERRO_SERVIDOR), errorMessage: desc.message, errorType: desc.errorType, fieldErrors: false, cause: ERRO_SERVIDOR }

  console.log('\x1b[31m')
  //* Tratamento de erros conhecidos
  if (desc.errorType == "SqliteError") {
    res = { ...res, ...handleSqliteError(desc) }
  } else {
    const { error, ...dados } = desc
    console.log(dados)
    console.error(error)
  }
  console.log('\x1b[0m', {})
  //* Resultado do tratamento
  return res
}

export function rateioEstoque(valorEncargoInt, estoque, campo, dadosPush) {
  let totalDividido = 0
  for (let i = 1; i < estoque.length; i++) {
    const est = estoque[i];
    const valor = Math.floor(est.percRateio * valorEncargoInt / 100) * 100
    if (valor === 0) continue
    totalDividido += valor
    est[campo].push({ ...dadosPush, valor })
  }
  const est = estoque[0]
  const valor = valorEncargoInt - totalDividido
  if (valor === 0) return
  est[campo].push({ ...dadosPush, valor })
}

/**
 * Cria um descritor padronizado para erros emitidos com `throw ...`
 * @param {any} error Erro emitido
 * @returns {ErrorDescription} Descritor do erro
 */
export function describeError(error) {
  const validObject = error !== null && typeof error == 'object'
  const isArray = Array.isArray(error)
  const instanceOfError = error instanceof Error
  const message = typeof error === 'string' ? error : error?.message?.toString() || "Sem mensagem do erro"
  const errorType = validObject ? error?.constructor?.name?.toString() || 'Object' : typeof error
  const properties = isArray || !validObject ? [] : Object.getOwnPropertyNames(error)
  return { error, message, errorType, instanceOfError, properties }
}

//!JSDocs
/** @typedef {Object.<string, string[]> | false} FieldErrors*/
/** @typedef {400 | 401 | 403 | 404 | 423 | 429 | 500 | 501 | 503} ErrorCauses */
/**
 * @typedef {Object} HandledError Objeto com descrição detalhada de um erro tratado
 * @property {string} message Mensagem final do erro tratado
 * @property {string} errorMessage Mensagem inicial do erro emitido
 * @property {string} errorType Nome da **classe** ou do **tipo** do erro emitido
 * @property {FieldErrors} fieldErrors Mapeamento de campos que geraram o erro emitido ou `false`
 * @property {ErrorCauses} cause Código genérico da causa do erro
 * @property {string} [errorCode] Código específico do erro emitido
*/

/**
 * @typedef {Object} ErrorDescription Detalhamento de um erro emitido
 * @property {*} error Erro emitido
 * @property {string} message Mensagem de especificação do erro emitido
 * @property {string} errorType Nome da **classe** ou do **tipo** do erro emitido
 * @property {boolean} instanceOfError É instância da classe `Error` (diretamente ou herança)
 * @property {string[]} properties Campos e propriedades do erro, se for um objeto ou classe
*/