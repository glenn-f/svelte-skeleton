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

export function formatCNPJ(value) {
  const cnpj = toNumericText(value, 14)
  const regex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/
  const mask = '$1.$2.$3/$4-$5'
  return cnpj.replace(regex, mask)
}

export function formatCPF(value) {
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
    console.log("Erro: formatMoeda(value) → `value` não é um número válido.")
    // throw new TypeError("O valor não é um número válido")
    return value?.toString() ?? ''
  }
}

export function toNumericText(value, size, padChar = '0') {
  return value.toString().replace(/\D/g, '').padStart(size, padChar).slice(0, size)
}
