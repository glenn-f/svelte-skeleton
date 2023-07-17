export function millisToHTMLdatetime(UTCmillis, HTMLoffsetMinutes = undefined) {
  UTCmillis = parseInt(UTCmillis)
  HTMLoffsetMinutes = parseInt(HTMLoffsetMinutes)
  if (Number.isInteger(UTCmillis)) {
    const adjustedOffset = (Number.isInteger(HTMLoffsetMinutes) ? HTMLoffsetMinutes : new Date().getTimezoneOffset()) * 60000
    const date = new Date(UTCmillis - adjustedOffset)
    const dia = date.getUTCDate().toString().padStart(2, '0')
    const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const ano = date.getUTCFullYear().toString().padStart(4, '0')
    const hora = date.getUTCHours().toString().padStart(2, '0')
    const minuto = date.getUTCMinutes().toString().padStart(2, '0')
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`
  }
  return undefined
}

export function HTMLdatetimeToMillis(HTMLdatetime, HTMLoffsetMinutes = undefined) {
  HTMLoffsetMinutes = parseInt(HTMLoffsetMinutes)
  if (typeof HTMLdatetime == 'string' && HTMLdatetime.length == 16) {
    const localDatetime = new Date(HTMLdatetime)
    const localOffset = localDatetime.getTimezoneOffset()
    const adjustedOffset = (localOffset - (Number.isInteger(HTMLoffsetMinutes) ? HTMLoffsetMinutes : localOffset)) * 60000
    return localDatetime.getTime() - adjustedOffset
  }
  return undefined
}

export function millisToHTMLdate(UTCmillis) {
  UTCmillis = parseInt(UTCmillis)
  if (Number.isInteger(UTCmillis)) {
    const date = new Date(UTCmillis)
    const dia = date.getUTCDate().toString().padStart(2, '0')
    const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const ano = date.getUTCFullYear().toString().padStart(4, '0')
    return `${ano}-${mes}-${dia}`
  }
  return undefined
}

export function HTMLdateToMillis(HTMLdate) {
  if (typeof HTMLdate == 'string' && HTMLdate.length == 10) {
    const date = new Date(HTMLdate + 'T00:00Z')
    return date.getTime()
  }
  return undefined
}

export function millisToHTMLtime(UTCmillis) {
  UTCmillis = parseInt(UTCmillis)
  if (Number.isInteger(UTCmillis) && UTCmillis > 0) {
    let horas = parseInt(UTCmillis / 3600000)
    let minutos = parseInt((UTCmillis - (horas * 3600000)) / 60000)
    const hora = horas.toString().padStart(2, '0')
    const minuto = minutos.toString().padStart(2, '0')
    return `${hora}:${minuto}`;
  }
  return undefined
}

export function HTMLtimeToMillis(HTMLtime) {
  if (typeof HTMLtime == 'string' && HTMLtime.length == 5) {
    let [horas, minutos] = HTMLtime.split(':')
    horas = parseInt(horas)
    minutos = parseInt(minutos)
    if (Number.isInteger(horas) && Number.isInteger(minutos) && horas < 24 && minutos < 60 && horas >= 0 && minutos >= 0) {
      return (horas * 3600000) + (minutos * 60000)
    }
  }
  return undefined
}

const currencyFractionDigits = 4;
const CFD = 10 ** currencyFractionDigits;
export function intToCurrency(intValue) {
  intValue = parseInt(intValue)
  if (Number.isInteger(intValue)) {
    return intValue / CFD;
  }
  return undefined
}

export function currencyToInt(currencyValue) {
  currencyValue = parseFloat(currencyValue)
  if (Number.isFinite(currencyValue)) {
    return parseInt(currencyValue * CFD)
  }
  return undefined
}