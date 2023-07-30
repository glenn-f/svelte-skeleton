import { DateTime } from "luxon";

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
  console.log(' LOG >>',DateTime.now().toFormat('HH:mm:ss'), JSON.stringify(data, null, 1))
}