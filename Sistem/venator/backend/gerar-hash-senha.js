// Uso: node gerar-hash-senha.js "SuaSenhaAqui"
// Copie o resultado para MASTER_SENHA_HASH no seu arquivo .env
const bcrypt = require("bcryptjs");

const senha = process.argv[2];
if (!senha) {
  console.error('Uso: node gerar-hash-senha.js "SuaSenhaAqui"');
  process.exit(1);
}
console.log(bcrypt.hashSync(senha, 10));
