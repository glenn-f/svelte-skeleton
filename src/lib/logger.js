import { DateTime } from "luxon";

export class Logger {
  static colors = {
    black: '\x1b[30m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
  };
  static bgs = {
    preto: "\u001b[40m", vermelho: "\u001b[41m", verde: "\u001b[42m", amarelo: "\u001b[43m", azul: "\u001b[44m", magenta: "\u001b[45m", ciano: "\u001b[46m", branco: "\u001b[47m",
  }

  static invert = "\u001b[7m"
  static reset = '\x1b[0m';
  static qntdEventos = 0
  constructor(event, dev) {
    this.dev = dev
    if (!dev) return
    this.numEvento = Logger.qntdEventos++
    this.inicio = DateTime.now()
    this.fim = null
    const rota = event.route.id ? ` → ${this.ct("Rota", "magenta")} ${this.ct(event.route.id ?? "?", 'cyan')}` : ""
    console.log(Logger.colors.blue + Logger.invert + this.inicio.toFormat("TT'.'u") + Logger.reset + ` [${this.numEvento}] ${this.ct(event.request.method, 'green')} ${this.ct(event.url.pathname + event.url.search, 'yellow')}` + rota)
    if (event.request.body) console.log(`\t${this.ct("Body:", 'blue')}`, event.request.body)
  }

  ct(texto, cor) {
    return Logger.colors[cor] + `${texto}` + Logger.reset
  }

  auth(texto, end = true) {
    console.log("\t" + this.ct(texto, "red"))
    if (end) this.end()
  }

  end(texto, cor = "blue") {
    if (!this.dev) return
    if (texto) console.log("\t" + this.ct(texto, cor))
    this.fim = DateTime.now()
    this.duracao = this.fim.diff(this.inicio)
    console.log(Logger.colors.cyan + Logger.invert + `------- Fim` + Logger.reset + ` [` + this.numEvento + "] " + this.ct(this.duracao.toMillis(), 'red') + " ms\n")
  }
}