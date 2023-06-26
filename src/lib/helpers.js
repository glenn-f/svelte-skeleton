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

export function toNumericText(value, size, padChar = '0') {
  return value.toString().replace(/\D/g, '').padStart(size, padChar).slice(0, size)
}
