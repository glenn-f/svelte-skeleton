import { ZodIssueCode, ZodParsedType, z as zod } from 'zod';
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
        message = `${issue.validation} inválido`;
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

zod.setErrorMap(ptBrErrorMap)
export const z = zod