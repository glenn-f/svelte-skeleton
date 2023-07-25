export function sqlValor(obj) {
  if (!obj) return [{}, '', '']
  const novoObj = {}
  //* criar novo objeto com valores formatados para os tipos de dados válidos em SQLite3
  for (const chave in obj) {
    const valor = obj[chave]
    //* se algum item do objeto inicial for undefined, não inserir no novo objeto *Regra de Negócio*
    if (valor === undefined) continue;
    novoObj[chave] = sqlValorInterna(valor)
  }
  //* criar strings de colunas e valores para o código SQL conforme as colunas do novoObj (prepare sql statement)
  let colunas = '', valores = ''
  const chaves = Object.keys(novoObj)
  const ultimo = chaves.length - 1
  for (let i = 0; i < ultimo; i++) {
    const chave = chaves[i];
    colunas += chave + ', '
    valores += '$' + chave + ', '
  }
  if (ultimo >= 0) {
    colunas += chaves[ultimo]
    valores += '$' + chaves[ultimo]
  }

  return [novoObj, colunas, valores]
}

function sqlValorInterna(valor) {
  if (typeof valor == 'object') {
    if (valor instanceof Date) {
      return valor.getTime()
    } else if (Buffer.isBuffer(valor)) {
      return valor
    } else if (valor == null) {
      return null
    } else {
      return JSON.stringify(valor)
    }
  } else if (typeof valor == 'boolean') {
    return valor ? 1 : 0
  } else if (typeof valor == 'function' || typeof valor == 'symbol') {
    throw new Error("Funções e Symbols não são aceitos.")
  }
  // bigint, number ou string
  return valor
}

export function sqlTabela(tabela) {
  if (typeof tabela == "string") return `'${tabela.replace(`'`, `''`)}'`
  else throw new Error("Apenas strings são aceitas nesta função.")
}

//TODO Função para escapar colunas de um campo sql
/* export function sqlColuna(coluna) {
  if (typeof coluna == "string") return `'${coluna.replace(`'`, `''`)}'`
  else throw new Error("Apenas strings são aceitas nesta função.")
} */

export function sqlValorKV(obj) {
  if (!obj) return [{}, '']
  const novoObj = {}
  let stringKV = []
  //* criar novo objeto com valores formatados para os tipos de dados válidos em SQLite3
  for (const chave in obj) {
    const valor = obj[chave]
    //* se algum item do objeto inicial for undefined, não inserir no novo objeto *Regra de Negócio*
    if (valor === undefined) continue;
    novoObj[chave] = sqlValorInterna(valor)
    stringKV.push(`${chave} = $${chave}`)
  }
  //* criar strings de colunas e valores para o código SQL conforme as colunas do novoObj (prepare sql statement)
  const setKV = stringKV.join(" , ")

  return [novoObj, setKV]
}

export function sqlValorSelect(arr) {
  if (!arr) return ''
  const novoArr = []
  for (let i = 0; i < arr.length; i++) {
    const campo = arr[i];
    if (typeof campo !== 'string') continue
    novoArr.push(campo.trim())
  }
  return novoArr.join(' , ')
}