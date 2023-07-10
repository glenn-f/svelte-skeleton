import { REP_COLABORADOR } from '$lib/globals'
import { resetarEmpresa } from '$lib/server/cache'
import { criarGPEInicial, db, dbTransaction } from '$lib/server/db'
import { resetarSessoesUsuario, sessionCookieSettings } from '$lib/server/session'
import { criarEmpresaSchema, editarEmpresaSchema } from '$lib/zod/schemas/empresa'
import { message, superValidate } from 'sveltekit-superforms/server'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    const id = locals.sessao.uid

    const query = db.prepare('SELECT id, nome_fantasia, razao_social, cnpj, inscricao_estadual, codigo_regime_tributario, pais, uf, municipio, bairro, cep, endereco, telefone FROM empresa WHERE dono_id = $id')
    const empresa = query.get({ id })

    if (empresa) {
        const form = await superValidate(empresa, editarEmpresaSchema, { id: "editar", errors: false })
        return { form }
    }

    const form = await superValidate(criarEmpresaSchema, { id: "criar" })
    return { form }

    // const formCriar = await superValidate(criarEmpresaSchema, { id: "criar" })
    // const formEditar = await superValidate(empresa, editarEmpresaSchema, { id: "editar" })
}

/** @type {import("./$types").Actions} */
export const actions = {
    cadastrar: async ({ request, locals, cookies }) => {
        const form = await superValidate(request, criarEmpresaSchema, { id: "criar" })
        if (form.valid) {
            const dono_id = locals.sessao.uid

            //* Criar empresa no BD
            const result = cadastrarEmpresa({ dono_id, ...form.data })
            if (result.ok) {
                //* Atualizar sessão
                const sessao = resetarSessoesUsuario(dono_id)
                cookies.set('sid', sessao.sid, { ...sessionCookieSettings, maxAge: sessao.expiracao / 1000 })

                //* Atualizar formulário
                const query = db.prepare('SELECT id, nome_fantasia, razao_social, cnpj, inscricao_estadual, codigo_regime_tributario, pais, uf, municipio, bairro, cep, endereco, telefone FROM empresa WHERE dono_id = $id')
                const empresa = query.get({ id: dono_id })

                if (empresa) {
                    const formEditar = await superValidate(empresa, editarEmpresaSchema, { id: "editar", errors: false })
                    resetarEmpresa(empresa.id)
                    return message(formEditar, "Empresa cadastrada com sucesso.")
                }
                return message(form, "Empresa cadastrada com sucesso.")
            } else {
                //* Erro no servidor
                return message(form, result.message, { status: 500 })
            }
        }
        //* Bad Request
        return message(form, "Erro no preenchimento dos campos.", { status: 400 })
    },
    editar: async ({ request, locals, cookies }) => {
        const form = await superValidate(request, editarEmpresaSchema, { id: "editar" })
        if (form.valid) {
            //* Verificações de Segurança
            const dono_id = locals.sessao.uid
            const checkQuery = db.prepare("SELECT dono_id FROM empresa WHERE id = $id")
            const checkResult = checkQuery.get({ id: form.data.id })
            if (!checkResult) return message(form, "Empresa não existe", { status: 404 })
            if (checkResult.dono_id !== dono_id) return message(form, "Permissão negada.", { status: 401 })

            //* Editar empresa no BD
            const query = db.prepare(
                "UPDATE empresa SET nome_fantasia = $nome_fantasia, razao_social = $razao_social, cnpj = $cnpj, inscricao_estadual = $inscricao_estadual, codigo_regime_tributario = $codigo_regime_tributario,\
pais = $pais, uf = $uf, municipio = $municipio, bairro = $bairro, cep = $cep, endereco = $endereco, telefone = $telefone WHERE id = $id")
            const result = query.run({ ...form.data })
            if (result.changes > 0) {
                //* Atualizar sessão
                const empresa = resetarEmpresa(form.data.id)
                const sessao = resetarSessoesUsuario(dono_id)
                cookies.set('sid', sessao.sid, { ...sessionCookieSettings, maxAge: sessao.expiracao / 1000 })

                //* OK
                return message(form, "Empresa atualizada com sucesso.")
            } else {
                //* Erro no servidor
                return message(form, "Empresa não atualizada, erro no servidor.", { status: 500 })
            }
        }
        //* Bad Request
        return message(form, "Erro no preenchimento dos campos.", { status: 400 })
    }
}

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