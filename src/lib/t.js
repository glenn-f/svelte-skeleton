const { z } = require('zod');

const schema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  permissao: z.string(),
  senha: z.string(),
  tipo_pessoa: z.enum([0, 1])
});

// Exemplo de uso:
const objetoValido = {
  id: '1',
  nome: 'John Doe',
  email: 'john@example.com',
  permissao: 'admin',
  senha: '123456',
  tipo_pessoa: 0
};

const objetoInvalido = {
  id: '2',
  nome: 'Jane Smith',
  email: 'jane@example.com',
  permissao: 'user',
  senha: 'abcdef',
  tipo_pessoa: 2
};

// Validação do objeto válido
const valido = schema.safeParse(objetoValido);
console.log(valido.success);  // true
console.log(valido.error);  // true

// Validação do objeto inválido
const invalido = schema.safeParse(objetoInvalido);
console.log(invalido.success);  // false
console.log(invalido.error.errors);  // Exibirá o erro de validação
