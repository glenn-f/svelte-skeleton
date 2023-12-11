import { begin, commit, db, rollback } from ".."

export async function desfazerProcessoEstoque(pe_id) {
  if (!Number.isInteger(pe_id)) return false
  try {
    begin.run()
    const { fc_ids: fc1, ...resFF } = await desfazerFluxoFinanceiro(pe_id)
    const { fc_ids: fc2, ...resFE } = await desfazerFluxoEstoque(pe_id)
    const { fc_ids: fc3, ...resFCG } = await desfazerFluxoContabilGrupo(pe_id)
    const { ...resFC } = await desfazerFluxoContabil(fc1, fc2, fc3)
    const pe_apagados = db.prepare(`DELETE FROM pe WHERE id = ?`).run(pe_id).changes
    const res = { ...resFF, ...resFE, ...resFCG, ...resFC, pe_apagados }
    commit.run()
    return true
  } catch (error) {
    rollback.run()
    console.error(error)
    return false
  }
}

async function desfazerFluxoFinanceiro(pe_id) {
  let placeholders = "";
  // 1 - Selecionar transacoes da tabela pe_transacao
  let transacoes = db.prepare("SELECT transacao_id FROM pe_transacao WHERE pe_id = ?").pluck().all(pe_id);
  // 2 - Apagar pe_transacao
  const pe_transacao_apagados = db.prepare("DELETE FROM pe_transacao WHERE pe_id = ?").run(pe_id).changes;
  // 3 - Selecionar transações.(transacao_ff_id e encargo_ff_id)
  placeholders = transacoes.map(() => '?').join(',');
  const encargo_ff_ids = [];
  const transacao_ff_ids = transacoes.length > 0 ? db.prepare(`SELECT transacao_ff_id, encargo_ff_id FROM transacao WHERE id IN (${placeholders})`).all(transacoes).map((v, i, arr) => {
    if (v.encargo_ff_id) encargo_ff_ids.push(v.encargo_ff_id)
    return v.transacao_ff_id
  }) : [];
  // 4 - Apagar transacaos
  const transacao_apagados = transacoes.length > 0 ? db.prepare(`DELETE FROM transacao WHERE id in (${placeholders})`).run(transacoes).changes : 0;
  // 5 - Juntar ff_ids
  const ff_ids = transacao_ff_ids.concat(encargo_ff_ids);
  // 6 - Select ff wherein ff_ids -> select valor, conta_id
  placeholders = ff_ids.map(() => '?').join(',');
  const ffs = ff_ids.length > 0 ? db.prepare(`SELECT conta_id, valor FROM ff WHERE id IN (${placeholders})`).all(ff_ids) : [];
  // 7 - mapeador contas e valores
  const contasAlteradas = new Map();
  ffs.forEach(v => {
    let inicial = contasAlteradas.get(v.conta_id) || 0;
    if ((v.valor || 0) !== 0) {
      contasAlteradas.set(v.conta_id, inicial + v.valor);
    }
  })
  // 8 - selecionar os fc_ids associados, se algum
  const fc_ids = ff_ids.length > 0 ? db.prepare(`SELECT fc_id FROM fc_ff WHERE ff_id in (${placeholders})`).pluck().all(ff_ids) : [];
  // 9 - apagar os fc_ff associados aos ff_ids
  const fc_ff_apagados = ff_ids.length > 0 ? db.prepare(`DELETE FROM fc_ff WHERE ff_id in (${placeholders})`).run(ff_ids).changes : 0;
  // 10 - apagar os ffs
  const ff_apagados = ff_ids.length > 0 ? db.prepare(`DELETE FROM ff WHERE id in (${placeholders})`).run(ff_ids).changes : 0;
  // 11 - atualizar saldos das contas
  let contas_atualizados = 0;
  for (const [id, valor] of contasAlteradas.entries()) {
    if (valor) {
      contas_atualizados += db.prepare(`UPDATE conta SET saldo = saldo - ? WHERE id = ?`).run(valor, id).changes
    }
  }
  return { fc_ids, pe_transacao_apagados, transacao_apagados, fc_ff_apagados, ff_apagados, contas_atualizados };
}

async function desfazerFluxoEstoque(pe_id) {
  let placeholders = "";
  // 1 - Selecionar fe e json da tabela pe_transacao
  let fes = db.prepare("SELECT id,estoque_id,tipo_fe,var_qntd,var_custo,alteracoes_json FROM fe WHERE pe_id = ?").all(pe_id);
  // 2 - Selecionar fc_ids
  placeholders = fes.map(() => "?").join(",");
  const fe_ids = fes.map(v => v.id)
  const fc_ids = fe_ids.length > 0 ? db.prepare(`SELECT fc_id FROM fc_fe WHERE fe_id in (${placeholders})`).pluck().all(fe_ids) : [];
  // 3 - atualizar estoques (reverter)
  let estoques_atualizados = 0;
  const reverterEstoqueStmt = db.prepare("UPDATE estoque SET qntd = qntd - ?, custo = custo - ? WHERE id = ?");
  for (const { var_custo, var_qntd, estoque_id } of fes) {
    if (var_qntd != 0 || var_custo != 0) {
      estoques_atualizados += reverterEstoqueStmt.run(var_qntd, var_custo, estoque_id).changes
    }
  }
  // 4 - apagar fc_fe's
  const fc_fe_apagados = fe_ids.length > 0 ? db.prepare(`DELETE FROM fc_fe WHERE fe_id in (${placeholders})`).run(fe_ids).changes : 0;
  // 4 - apagar fe's
  const fe_apagados = fe_ids.length > 0 ? db.prepare(`DELETE FROM fe WHERE id in (${placeholders})`).run(fe_ids).changes : 0;

  return { fc_ids, fc_fe_apagados, fe_apagados, estoques_atualizados };
}


async function desfazerFluxoContabilGrupo(pe_id) {
  let placeholders = "";
  // 1 - Selecionar pe_fcg.fcg_id's
  const fcg_ids = db.prepare("SELECT fcg_id FROM pe_fcg WHERE pe_id = ?").pluck().all(pe_id);

  // 2 - Apagar pe_fcgs
  const pe_fcg_apagados = db.prepare("DELETE FROM pe_fcg WHERE pe_id = ?").run(pe_id).changes;

  // 3 - Selecionar fcs
  placeholders = fcg_ids.map(() => '?').join(',');
  const fc_ids = fcg_ids.length > 0 ? db.prepare(`SELECT id FROM fc WHERE fcg_id IN (${placeholders})`).pluck().all(fcg_ids) : [];

  return { fc_ids, pe_fcg_apagados };
}

/** @param  {...[number]} arrays  */
async function desfazerFluxoContabil(...arrays) {
  //* Unir arrays sem duplicatas
  const fcSet = new Set();
  for (const arr of arrays) {
    for (const el of arr) {
      fcSet.add(el)
    }
  }
  //* Selecionar FCGs, se existirem
  const fcgSet = new Set();
  const fc_ids = Array.from(fcgSet.values());
  let placeholders = fc_ids.map(() => '?').join(',')
  let fcg_ids = fc_ids.length > 0 ? db.prepare(`SELECT fcg_id FROM fc WHERE fcg_id is not null AND id IN (${placeholders})`).pluck().all(fc_ids) : [];
  fcg_ids.forEach(v => fcgSet.add(v))
  fcg_ids = Array.from(fcgSet.values())

  //* Desfazer Tributos
  const resTributos = await desfazerTributos(fc_ids)

  //* Desfazer Tributos
  const resComissao = await desfazerComissoes(fc_ids)

  //* Apagar FCs
  const fc_apagados = fc_ids.length > 0 ? db.prepare(`DELETE FROM fc WHERE id in (${placeholders})`).run(fc_ids).changes : 0;

  //* Apagar FCGs
  placeholders = fcg_ids.map(() => '?').join(',')
  const fcg_apagados = fcg_ids.length > 0 ? db.prepare(`DELETE FROM fcg WHERE id in (${placeholders})`).run(fcg_ids).changes : 0;
  return { fc_apagados, fcg_apagados, ...resComissao, ...resTributos }
}

async function desfazerTributos(fc_ids) {
  if (fc_ids.length === 0) return { tributo_contabil_apagados: 0, tributo_apagados: 0 }
  //* Selecionar tributos
  let placeholders = fc_ids.map(() => '?').join(',')
  let tributo_ids = db.prepare(`SELECT tributo_id FROM tributo_contabil WHERE fc_id IN (${placeholders})`).pluck().all(fc_ids);

  //* Apagar Tributos Contábeis
  const tributo_contabil_apagados = db.prepare(`DELETE FROM tributo_contabil WHERE fc_id in (${placeholders})`).run(fc_ids).changes;
  //* Apagar Tributos
  const tributo_apagados = tributo_ids.length > 0 ? db.prepare(`DELETE FROM tributo WHERE id in (${placeholders})`).run(tributo_ids).changes : 0;
  return { tributo_contabil_apagados, tributo_apagados }
}

async function desfazerComissoes(fc_ids) {
  if (fc_ids.length === 0) return { comissao_contabil_apagados: 0, comissao_apagados: 0 }
  //* Selecionar comissoes
  let placeholders = fc_ids.map(() => '?').join(',')
  let comissao_ids = db.prepare(`SELECT comissao_id FROM comissao_contabil WHERE fc_id IN (${placeholders})`).pluck().all(fc_ids);

  //* Apagar Comissões Contábeis
  const comissao_contabil_apagados = db.prepare(`DELETE FROM comissao_contabil WHERE fc_id in (${placeholders})`).run(fc_ids).changes;
  //* Apagar Comissões
  const comissao_apagados = comissao_ids.length > 0 ? db.prepare(`DELETE FROM comissao WHERE id in (${placeholders})`).run(comissao_ids).changes : 0;
  return { comissao_contabil_apagados, comissao_apagados }
}