import { REP_COLABORADOR } from '$lib/globals'
import { resetarEmpresa } from '$lib/server/cache'
import { db, dbTransaction } from '$lib/server/db'
import { detalharEmpresaPerfil } from '$lib/server/db/models/empresa'
import { criarGPEInicial } from '$lib/server/db/models/grupoPermissao'
import { resetarSessoesUsuario, sessionCookieSettings } from '$lib/server/loginSessao'
import { criarEmpresaSchema, editarEmpresaSchema } from '$lib/zod/schemas/empresa'
import { message, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
    const dono_id = locals.sessao.uid
    const empresa = detalharEmpresaPerfil({ dono_id })
    const form = empresa ?
        superValidate(empresa, editarEmpresaSchema, { id: "editar", errors: false }) :
        superValidate(criarEmpresaSchema, { id: "criar" })
    return { form }
}

export const actions = {
    cadastrar: async ({ request, locals, cookies }) => {
        //* Validar dados recebidos
        const form = await superValidate(request, criarEmpresaSchema, { id: "criar" })
        if (!form.valid) return message(form, "Erro no preenchimento dos campos.", { status: 400 })

        //* Atualizar banco de dados
        const dono_id = locals.sessao.uid
        const resEmpresa = cadastrarEmpresa({ dono_id, ...form.data })
        if (!resEmpresa.ok) return message(form, resEmpresa.message, { status: 500 })
        //TODO tratar erro de banco: restrições de integridade

        //* Atualizar sessão
        const resSessao = resetarSessoesUsuario(dono_id)
        if (!resSessao.valid) return message(form, "A sessão não foi resetada", { status: 500 })
        cookies.set('sid', resSessao.data.sid, { ...sessionCookieSettings, maxAge: resSessao.data.expiracao / 1000 })

        //* Carregar empresa criada
        const empresa = detalharEmpresaPerfil({ dono_id })
        if (empresa) {
            const formEditar = await superValidate(empresa, editarEmpresaSchema, { id: "editar", errors: false })
            resetarEmpresa(empresa.id)
            return message(formEditar, "Empresa cadastrada com sucesso.")
        }
        return message(form, "Empresa cadastrada com sucesso.")
    },
    editar: async ({ request, locals, cookies }) => {
        //* Validar dados recebidos
        const form = await superValidate(request, editarEmpresaSchema, { id: "editar" })
        if (!form.valid) return message(form, "Erro no preenchimento dos campos.", { status: 400 })

        //* Validar banco de dados
        const dono_id = locals.sessao.uid
        const empresa = db.prepare("SELECT dono_id FROM empresa WHERE id = $id").get({ id: form.data.id })
        if (!empresa) return message(form, "Empresa não existe", { status: 404 })
        if (empresa.dono_id !== dono_id) return message(form, "Permissão negada.", { status: 401 })

        //* Atualizar banco de dados
        const query = db.prepare("UPDATE empresa SET nome_fantasia = $nome_fantasia, razao_social = $razao_social, cnpj = $cnpj, inscricao_estadual = $inscricao_estadual, codigo_regime_tributario = $codigo_regime_tributario,\
pais = $pais, uf = $uf, municipio = $municipio, bairro = $bairro, cep = $cep, endereco = $endereco, telefone = $telefone WHERE id = $id")
        const result = query.run({ ...form.data })
        if (result.changes === 0) return message(form, "Empresa não atualizada, erro no servidor.", { status: 500 })

        //* Atualizar sessão
        resetarEmpresa(form.data.id)
        const resSessao = resetarSessoesUsuario(dono_id)
        if (!resSessao.valid) return message(form, "A sessão não foi resetada", { status: 500 })

        //* Atualizar cookies e enviar resposta
        const { sid, expiracao } = resSessao.data
        cookies.set('sid', sid, { ...sessionCookieSettings, maxAge: expiracao / 1000 })
        return message(form, "Empresa atualizada com sucesso.")
    }
}

//TODO Mover para models/empresa
/**
 * @param {any} dados
 * @returns {{ok: boolean message: string}}
 */
function cadastrarEmpresa(dados) {
    return dbTransaction(() => {
        const queryEmpresa = db.prepare("INSERT INTO empresa (dono_id, nome_fantasia, razao_social, cnpj, inscricao_estadual, codigo_regime_tributario, pais, uf, municipio, bairro, cep, endereco, telefone)\
VALUES ($dono_id, $nome_fantasia, $razao_social, $cnpj, $inscricao_estadual, $codigo_regime_tributario, $pais, $uf, $municipio, $bairro, $cep, $endereco, $telefone)")
        const resEmpresa = queryEmpresa.run(dados)
        if (resEmpresa.changes > 0) {
            const usuario_id = dados.dono_id
            const empresa_id = resEmpresa.lastInsertRowid

            const gpe_id = criarGPEInicial(empresa_id)
            if (!gpe_id) return { ok: false, message: "Empresa não foi criada (gpe)" }

            const pessoa_id = criarColaboradorViaUsuario(usuario_id, empresa_id)
            if (!pessoa_id) return { ok: false, message: "Empresa não foi criada (pessoa)" }

            const queryUsuarioEmpresa = db.prepare("INSERT INTO usuario_empresa (usuario_id, empresa_id, gpe_id, pessoa_id)\
VALUES ($usuario_id, $empresa_id, $gpe_id, $pessoa_id)")
            const resUsuarioEmpresa = queryUsuarioEmpresa.run({ usuario_id, empresa_id, gpe_id, pessoa_id })
            if (resUsuarioEmpresa.changes > 0) {
                return { ok: true, message: "Empresa criada com sucesso." }
            }
            console.log({ erro: "cadastrarEmpresa", evento: "Tabela intermediária" })
            return { ok: false, message: "Empresa não foi criada (user_empr)" }
        }
        console.log({ erro: "cadastrarEmpresa", evento: "Tabela inicial" })
        return { ok: false, message: "Empresa não foi criada (empr)" }
    })()
}

function criarColaboradorViaUsuario(criador_id, empresa_id) {
    const query = db.prepare("SELECT nome, email FROM usuario WHERE id = $id")
    const { nome, email } = query.get({ id: criador_id })
    const mutate = db.prepare("INSERT INTO pessoa (empresa_id, criador_id, rep, nome, email)\
VALUES ($empresa_id, $criador_id, $rep, $nome, $email)")
    const res = mutate.run({ empresa_id, criador_id, rep: REP_COLABORADOR, nome, email })
    if (res.changes > 0) {
        return res.lastInsertRowid
    }
    return undefined
}