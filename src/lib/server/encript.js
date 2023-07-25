import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

/**
 * Encriptador de senha que usa `bcrypt (com salt)`
 * @param {string} senha Senha em texto pleno: será encriptada e retornada
 * @param {string} rounds Quantidade de rodadas de encriptação (potência de 10)
 * @returns {string | undefined} Senha encriptada (hash)
 */
export function encriptarSenha(senha, rounds = 10) {
  return senha ? bcrypt.hashSync(senha, rounds) : undefined
}

/**
 * Verifica se as senhas são iguais utilizando `bcrypt (com salt)`
 * @param {string} senha Senha candidata em texto pleno: será encriptada e comparada com a senha real
 * @param {string} senhaEncriptada Senha real encriptada: será apenas usada para comparação
 * @returns {boolean} Resultado da comparação entra as senhas
 */
export function compararSenhas(senha, senhaEncriptada) {
  return bcrypt.compareSync(senha, senhaEncriptada)
}

/**
 * Gera uma string aleatória de dígitos hexadecimais a partir de uma quantidade de bytes
 * @param {number} bytes Quantidade de bytes para geração e transformados em HexString
 * @returns {string} String PseudoAleatória
 */
export function gerarRandomHex(bytes = 16) {
  return randomBytes(bytes).toString('hex')
}