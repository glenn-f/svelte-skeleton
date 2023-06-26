function applyMask(pattern, text, cursorPosition) {
  let maskedText = ''
  let unmaskedText = ''
  let maskedCursorPosition = cursorPosition
  let patternChars = ['0', 'a', '_']
  for (let p = 0, t = 0; p < pattern.length; p++) {
    const pChar = pattern[p]
    if (text.length > 0) {
      //? Texto ainda tem caracteres para serem avaliados
      //* Verificar o padrão é um marcador ou uma máscara
      if (patternChars.includes(pChar)) {
        //! Caractere é marcador regex -> consumir texto
        let consumido = false
        do {
          const tChar = text[0]
          text = text.slice(1)
          const isAlfa = /^[a-zA-Z]$/.test(tChar)
          const isDig = /^[0-9]$/.test(tChar)
          if ((pChar === '0' && isDig) || (pChar === 'a' && isAlfa) || (pChar === '_' && (isAlfa || isDig))) {
            //* Padrão possui correspondência com o texto
            consumido = true
            maskedText += tChar
            unmaskedText += tChar
            t++
            break;
          } else if (t < maskedCursorPosition) {
            maskedCursorPosition--
          }
        } while (text.length > 0);
        if (!consumido) {
          //* Padrão não possui correspondência com o texto. Remover caractere do texto e colocar placeholder
          maskedText += '_'
        }
      } else {
        //! Caractere é máscara placeholder -> nao consumir texto, colocar placeholder
        maskedText += pChar
        if (text[0] === pChar) {
          text = text.slice(1)
          t++;
        } else if (t < maskedCursorPosition) {
          maskedCursorPosition++
        }
      }
    } else {
      //? Texto não possui mais caracteres
      maskedText += pattern.slice(p)
      break;
    }
  }

  return [maskedText, unmaskedText, maskedCursorPosition]
}

const pattern = '00000-000'
const text = '1234512345' //12345-123
const text2 = '1245345-123' //12453-451
const cursorPosition = 8

let t1 = applyMask(pattern, text, cursorPosition)
let t2 = applyMask(pattern, text2, cursorPosition)

console.log({ t1, t2 })