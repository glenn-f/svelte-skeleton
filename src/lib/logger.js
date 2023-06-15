import moment from "moment/moment";

export class Logger {
  static colors = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };

  static reset = '\x1b[0m';
  static qntdEventos = 0
  constructor(event, dev) {
    this.dev = dev
    if (!dev) return
    this.numEvento = Logger.qntdEventos++
    this.event = event;
    this.inicio = moment()
    this.fim = null
    const rota = event.route.id ? ` → ${this.ct("Rota", "magenta")} ${this.ct(event.route.id ?? "?", 'cyan')}` : ""
    console.log(this.inicio.format("HH:mm:ss.SS") + ` [${this.numEvento}] ${this.ct(event.request.method, 'green')} ${this.ct(event.url.pathname, 'yellow')}` + rota)
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
    this.fim = moment()
    this.duracao = this.fim.diff(this.inicio, "millisecond")
    console.log(`------- Fim [` + this.numEvento + "] " + this.ct(this.duracao, 'red') + " ms\n")
  }
}