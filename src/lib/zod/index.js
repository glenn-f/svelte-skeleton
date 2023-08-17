import { setError } from 'sveltekit-superforms/server';
import { ZodIssueCode, ZodParsedType, z } from 'zod';

//! Helpers
export function deleteUndefined(obj) {
  for (const key in obj)
    if (obj[key] === undefined)
      delete obj[key]
  return obj;
}

/**
 * 
 * @param {import('sveltekit-superforms').SuperValidated<import('sveltekit-superforms').ZodValidation<z.AnyZodObject>} form 
 * @param {import('$lib/server/db').DBRun<import('$lib/server/db/models/processoEstoque').Entrada} res 
 */
export function setDBErrors(form, res) {
  if (res.fieldErrors)
    for (let [field, text] of Object.entries(res.fieldErrors))
      setError(form, field, text)
}

export function stringUndefined(schema) {
  return z.preprocess(text => text === '' ? undefined : text, schema)
}

//! Tipos Padronizados
export const zNumericEnum = (list, errorMsg = "Escolha uma opção") => z.custom((v) => list.includes(Number(v)), errorMsg)
export const zEnum = (list, errorMsg = "Escolha uma opção") => z.custom((v) => list.includes(v), errorMsg)
export const zOptional = (zSchema) => z.literal('').nullish().transform(() => undefined).or(zSchema)
export const zTString = z.string().trim().min(1)
export const zDate = z.union([z.coerce.number(), z.string().trim().min(1), z.date()], { invalid_type_error: 'Data inválida' }).pipe(z.coerce.date())
export const zCEP = z.string().trim().regex(/^\d{8}$/, "CEP inválido")
export const zCPF = z.string().trim().regex(/^\d{11}$/, "CPF inválido")
export const zCNPJ = z.string().trim().regex(/^\d{14}$/, 'CNPJ inválido')
export const zTelBR = z.string().trim().regex(/^\d{10,11}$/, 'Telefone inválido')
export const zRG = z.string().trim().regex(/^\d+$/, 'RG inválido')
export const zEmail = z.string().trim().email('E-mail inválido')
export const zNumber = z.coerce.number().finite('Número inválido')
export const zInt = z.coerce.number({ invalid_type_error: "Campo obrigatório" }).int('Número inválido')
export const zCurrency = z.coerce.number({ invalid_type_error: "Campo obrigatório" }).nonnegative('Deve ser positivo ou zero')
export const zMoeda = z.number({ invalid_type_error: "Campo obrigatório" }).min(0.0001, 'Deve ser maior que zero')
export const zContabil = z.number({ invalid_type_error: "Campo obrigatório" })
export const zID = z.coerce.number({ invalid_type_error: "ID inválido" }).int('ID deve ser inteiro')

//! Esquemas Genéricos
export const idSchema = z.object({ id: zID })

//! Tradução pt-BR
const mapTypes = {
  ['string']: 'texto',
  ['number']: 'número',
  ['bigint']: '(bigint)',
  ['boolean']: 'booleano',
  ['symbol']: '(symbol)',
  ['undefined']: '(undefined)',
  ['object']: 'objeto',
  ['function']: 'função',
  ['map']: 'mapa',
  ['nan']: '(NaN)',
  ['integer']: 'número inteiro',
  ['float']: 'número decimal',
  ['date']: 'data',
  ['null']: '(null)',
  ['array']: 'lista',
  ['unknown']: '(unknown)',
  ['promise']: '(promise)',
  ['void']: '(void)',
  ['never']: '(never)',
  ['set']: 'conjunto',
};

function joinValues(array, separator = ' | ') {
  return array
    .map((val) => (typeof val === 'string' ? `'${val}'` : val))
    .join(separator);
}

/** @typedef {import('zod').ZodErrorMap} */
function ptBrErrorMap(issue, ctx) {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Campo obrigatório';
      } else {
        message = `Era esperado(a) ${mapTypes[issue.expected]
          }, foi recebido(a) ${mapTypes[issue.received]}`;
      }
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Chaves desconhecidas no objeto: ${joinValues(
        issue.keys,
        ', '
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `União Inválida.`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Discriminador de união inválido. Era esperado ${joinValues(
        issue.options
      )}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Era esperado(a) ${joinValues(
        issue.options
      )}, foi recebido(a) '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Argumentos da função inválidos`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Tipo de retorno de função inválido`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Data inválida`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Dados inválidos: deve-se incluir "${issue.validation.includes}"`;

          if (typeof issue.validation.position === 'number') {
            message = `${message} em uma ou mais posições maiores ou iguais a ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Deve começar com "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Deve terminar com "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `${issue.validation.at(0).toUpperCase() + issue.validation.substring(1)} inválido`;
      } else {
        message = 'Expressão Regular Inválida';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `Deve conter ${issue.exact
          ? 'exatamente'
          : issue.inclusive
            ? `no mínimo`
            : `mais que`
          } ${issue.minimum} elemento(s)`;
      else if (issue.type === 'string')
        message = `Deve conter ${issue.exact
          ? 'exatamente'
          : issue.inclusive
            ? `no mínimo`
            : `mais que`
          } ${issue.minimum} caractere(s)`;
      else if (issue.type === 'number')
        message = `Deve ser ${issue.exact
          ? `exatamente igual a `
          : issue.inclusive
            ? `igual ou maior que `
            : `maior que `
          }${issue.minimum}`;
      else if (issue.type === 'date')
        message = `Deve ser ${issue.exact
          ? `exatamente igual a `
          : issue.inclusive
            ? `igual ou maior que `
            : `maior que `
          }${new Date(Number(issue.minimum))}`;
      else message = 'Inválido';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `Deve conter ${issue.exact
          ? `exatamente`
          : issue.inclusive
            ? `no máximo`
            : `menos que`
          } ${issue.maximum} elemento(s)`;
      else if (issue.type === 'string')
        message = `Deve conter ${issue.exact
          ? `exatamente`
          : issue.inclusive
            ? `no máximo`
            : `menos que`
          } ${issue.maximum} caractere(s)`;
      else if (issue.type === 'number' || issue.type === 'bigint')
        message = `Deve ser ${issue.exact
          ? `exatamente`
          : issue.inclusive
            ? `menor ou igual a`
            : `menor que`
          } ${issue.maximum}`;
      else if (issue.type === 'date')
        message = `Deve ser ${issue.exact
          ? `exatamente`
          : issue.inclusive
            ? `igual ou menor que`
            : `menor que`
          } ${new Date(Number(issue.maximum))}`;
      else message = 'Inválido';
      break;
    case ZodIssueCode.custom:
      message = `Entrada inválida`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Interseção não pôde ser mesclada`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Deve ser múltiplo de ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Deve ser finito';
      break;
    default:
      message = ctx.defaultError;
  }
  return { message };
};

z.setErrorMap(ptBrErrorMap)

export { z }