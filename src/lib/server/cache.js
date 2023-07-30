import { detalharEmpresa } from './db/models/empresa'
import { detalharGPE } from './db/models/grupoPermissao'

//! Empresa

export const cacheEmpresa = new Map()

export function buscarEmpresa(id) {
  if (!id) return undefined
  if (cacheEmpresa.has(id)) {
    return cacheEmpresa.get(id)
  } else {
    return atualizarEmpresa(id)
  }
}

export function atualizarEmpresa(id) {
  const empresa = detalharEmpresa({ id })
  if (empresa) {
    cacheEmpresa.set(id, empresa)
    return empresa
  }
  return undefined
}

export function resetarEmpresa(id) {
  cacheEmpresa.delete(id)
  return atualizarEmpresa(id)
}

//! Grupo de Permissão de Empresa

export const cacheGPE = new Map()

export function buscarGPE(id) {
  if (!id) return undefined
  if (cacheGPE.has(id)) {
    return cacheGPE.get(id)
  } else {
    return atualizarGPE(id)
  }
}

export function atualizarGPE(id) {
  const gpe = detalharGPE({ id })
  if (gpe) {
    cacheGPE.set(id, gpe)
    return gpe
  }
  return undefined
}

export function resetarGPE(id) {
  cacheGPE.delete(id)
  return atualizarGPE(id)
}