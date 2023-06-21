import { listarUsuarios } from '$lib/server/db';
import { PERM_APP } from '$lib/globals';

export async function load() {
    const usuarios = listarUsuarios()
    usuarios?.forEach((u) => {
        if (u.id === 0) {
            u.permUsuario = "Administrador"
            u.criador = '-'
        } else if (u.permUsuario in PERM_APP) {
            u.permUsuario = PERM_APP[u.permUsuario]
        } else {
            console.log(`Permissão não encontrada ou nula: ${u.permUsuario}`)
        }
    })
    return { usuarios };
};