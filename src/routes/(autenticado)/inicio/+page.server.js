import { dbGraficoFatPessoa30dias, dbGraficoFaturamento30dias } from "$lib/server/db/models/dashboard";
import { error } from "console";

export async function load({ locals }) {
    const empresa_id = locals.sessao.empresa_id
    const resFat30 = dbGraficoFaturamento30dias({ empresa_id })
    const resPesFat30 = dbGraficoFatPessoa30dias({ empresa_id })
    if (!resFat30.valid) throw error(500, 'Erro no servidor')
    const grafFat30 = resFat30.data
    const grafPesFat30 = resPesFat30.data
    return { grafFat30, grafPesFat30 };
};