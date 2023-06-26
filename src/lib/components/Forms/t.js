const moeda = "010001,";
const regex =/^(0+)(?=\d)/g
const match = regex.exec(moeda);
const posicao = match ? (match[1] || '').length : 0;
console.log(posicao, moeda, moeda.slice(posicao));