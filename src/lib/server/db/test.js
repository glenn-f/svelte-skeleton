import { criarUsuario } from '.'

const query = criarUsuario({ email: 'email', senha: "senha", nome: "nome", permUsuario: null, criador_id: "criador_id" })
console.log(query)
