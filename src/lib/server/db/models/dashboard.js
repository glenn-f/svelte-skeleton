import { mapCausasErro } from "$lib/globals"
import { handleAnyError } from "$lib/helpers"
import { db } from ".."

export function dbGraficoFaturamento30dias(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("WITH ds AS (SELECT -30 + row_number() OVER () AS dia_offset FROM sqlite_master LIMIT 30) \
SELECT date('now', ds.dia_offset || ' days') AS dia,COALESCE(CAST(SUM(fc.valor) AS REAL)/10000, 0) AS faturamento FROM ds \
LEFT JOIN pe ON date('now', ds.dia_offset || ' days') = strftime('%Y-%m-%d', datetime(pe.criacao / 1000, 'unixepoch')) AND pe.empresa_id = $empresa_id \
LEFT JOIN fe ON pe.id = fe.pe_id AND fe.tipo_fe BETWEEN 101 AND 200 \
LEFT JOIN fc_fe on fe.id = fc_fe.fe_id LEFT JOIN fc ON fc.id = fc_fe.fc_id AND fc.tipo_fc BETWEEN 1001 AND 2000 \
GROUP BY dia;").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    return { valid: false, message: mapCausasErro.get(cause), errorType, fieldErrors, code: cause }
  }
}

export function dbGraficoFatPessoa30dias(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("WITH ds AS ( SELECT -30 + row_number() OVER () AS dia_offset FROM sqlite_master LIMIT 30), \
all_pessoas AS ( SELECT id, nome FROM pessoa WHERE rep = 1 AND delecao IS NULL) \
SELECT strftime('%d/%m/%Y','now', ds.dia_offset || ' days') AS dia, all_pessoas.nome, COALESCE(CAST(SUM(pessoa_receita.valor) AS REAL) / 10000, 0) AS faturamento \
FROM ds CROSS JOIN all_pessoas LEFT JOIN ( \
  SELECT pessoa.id, pessoa.nome,strftime('%Y-%m-%d', datetime(pe.criacao / 1000, 'unixepoch')) AS dia_receita,fc.valor FROM pessoa \
  LEFT JOIN fe ON fe.responsavel_id = pessoa.id JOIN pe ON pe.id = fe.pe_id AND pe.empresa_id = $empresa_id JOIN fc_fe ON fe.id = fc_fe.fe_id \
  JOIN fc ON fc_fe.fc_id = fc.id AND fc.tipo_fc BETWEEN 1001 AND 2000 \
  WHERE pessoa.rep = 1 AND pessoa.delecao IS NULL) AS pessoa_receita ON \
ds.dia_offset = (SELECT dia_offset FROM ds WHERE date('now', ds.dia_offset || ' days') = pessoa_receita.dia_receita) \
AND all_pessoas.id = pessoa_receita.id GROUP BY ds.dia_offset, all_pessoas.id;").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    return { valid: false, message: mapCausasErro.get(cause), errorType, fieldErrors, code: cause }
  }
}
