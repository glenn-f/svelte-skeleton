<script>
  import { afterUpdate } from 'svelte'
  import Label from './Label.svelte'

  function applyMask(pattern, text, cursorPosition = 0) {
    let maskedText = ''
    let unmaskedText = ''
    let maskedCursorPosition = cursorPosition
    let patternChars = ['0', 'a', '_']
    const placeholder = '_'
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
            if ((pChar === '0' && isDig) || (pChar === 'a' && isAlfa) || (pChar === '_' && (isAlfa || isDig || pChar === tChar))) {
              //* Padrão possui correspondência com o texto
              consumido = true
              maskedText += tChar
              unmaskedText += tChar
              t++
              break
            } else if (t < maskedCursorPosition - 1) {
              maskedCursorPosition--
            }
          } while (text.length > 0)
          if (!consumido) {
            //* Padrão não possui correspondência com o texto. Remover caractere do texto e colocar placeholder
            maskedText += placeholder
          }
        } else {
          //! Caractere é máscara placeholder -> nao consumir texto, colocar placeholder
          maskedText += pChar
          if (text[0] === pChar) {
            text = text.slice(1)
            t++
          } else if (t <= maskedCursorPosition) {
            maskedCursorPosition++
          }
        }
      } else {
        //? Texto não possui mais caracteres
        maskedText += pattern.slice(p).replaceAll(/[0a]/g, '_')
        break
      }
    }

    return [maskedText, unmaskedText, maskedCursorPosition]
  }

  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?string} */
  export let autocomplete = 'off'
  /** @type {?string} */
  export let name = undefined
  /** @type {?(string | string[])} */
  export let error = undefined
  /** @type {?string} */
  export let warning = undefined
  /** @type {?string} */
  export let success = undefined
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
  /** @type {?string} */
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
  /** @type {?any} */
  export let value = undefined
  /** @type {string} */
  export let mask = '00000-000'
  let maskValue = applyMask(mask, value)[0]
  let inputMasked, selectionPos

  function handleInput({ target, inputType }) {
    const [maskedText, unmaskedText, maskedCursorPosition] = applyMask(mask, target.value, target.selectionStart)
    if (inputType == 'insertText') {
      selectionPos = maskedCursorPosition
      maskValue = maskedText
    } else {
      selectionPos = target.selectionStart
    }
    value = unmaskedText
  }

  function handleBlur({ target }) {
    const [maskedText, unmaskedText] = applyMask(mask, target.value, target.selectionStart)
    maskValue = maskedText
    value = unmaskedText
  }

  afterUpdate(() => {
    inputMasked.setSelectionRange(selectionPos, selectionPos)
  })
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    bind:this={inputMasked}
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="text"
    class={'input ' + inputClass}
    {autocomplete}
    id={'InputMask' + name}
    {required}
    on:input={handleInput}
    on:blur={handleBlur}
    bind:value={maskValue}
  />
  <input type="hidden" {name} bind:value />
</Label>
