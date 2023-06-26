<script>
  import { formatMoeda } from '$lib/helpers'
  import { onMount } from 'svelte'
  function maskLoop(cPos, text, limiteInferior, virgula, milhar) {
    let mask = ''
    for (let c = text.charAt(cPos); cPos >= limiteInferior; c = text.charAt(--cPos)) {
      if (c === ',') {
        if (!virgula) {
          milhar = 0
          virgula = 1
          mask = ',' + mask
        }
        continue
      } else if (c === '.') continue
      if (milhar > 0 && milhar % 3 === 0) mask = '.' + mask
      if (milhar > -1) milhar += 1
      mask = c + mask
    }
    return [mask, virgula, milhar]
  }
  /** Recebe uma string numérica com ou sem máscara e retorna a nova máscara de texto e a posição do cursor de seleção textual.
   * Só pode receber textos no formato pt-BR. Se a string `initialValue` for no formato en-US o resultado será incorreto.
   * @param {string} initialValue
   * @param {number} selPos
   * @param {number | null} digAposVirgula
   */
  function maskMoeda(initialValue, selPos, digAposVirgula = undefined) {
    digAposVirgula = parseInt(digAposVirgula) >= 0 ? parseInt(digAposVirgula) : -1
    const lastCharPos = initialValue.length - 1
    const selCharPos = selPos - 1
    const cursorChar = selPos ? initialValue.charAt(selCharPos) : null
    /** Texto antes da posição do cursor do texto*/
    let as = ''
    /** Texto depois a posição do cursor do texto*/
    let ds = ''
    /** Em qual parte do texto a vírgula é encontrada (-1: Antes, 1: depois, 0: não encontrada) */
    let virgularEncontrada = 0
    /** Contador de milhar no texto da máscara (-1: indefinido) */
    let milharCount = initialValue.indexOf(',') === -1 ? 0 : -1
    let maskInfo

    //* Depois do cursor
    maskInfo = maskLoop(lastCharPos, initialValue, selPos, virgularEncontrada, milharCount)
    ds = maskInfo[0]
    virgularEncontrada = maskInfo[1]
    milharCount = maskInfo[2]
    // for (let i = lastCharPos, c = initialValue.charAt(lastCharPos); i >= selPos; i--, c = initialValue.charAt(i)) {
    //   if (c === ',') {
    //     if (!virgularEncontrada) {
    //       milharCount = 0
    //       virgularEncontrada = 1
    //       ds = ',' + ds
    //     }
    //     continue
    //   } else if (c === '.') continue
    //   if (milharCount > 0 && milharCount % 3 === 0) ds = '.' + ds
    //   if (milharCount > -1) milharCount += 1
    //   ds = c + ds
    // }

    //* Antes do cursor
    maskInfo = maskLoop(selCharPos, initialValue, 0, virgularEncontrada, milharCount)
    as = maskInfo[0]
    virgularEncontrada = maskInfo[1]
    milharCount = maskInfo[2]
    // for (let i = selCharPos, c = initialValue.charAt(selCharPos); i >= 0; i--, c = initialValue.charAt(i)) {
    //   if (c === ',') {
    //     if (!virgularEncontrada) {
    //       milharCount = 0
    //       virgularEncontrada = -1
    //       as = ',' + as
    //     }
    //     continue
    //   } else if (c === '.') continue

    //   if (milharCount > 0 && milharCount % 3 === 0) as = '.' + as
    //   if (milharCount > -1) milharCount += 1
    //   as = c + as
    // }

    //* Resultado da máscara
    let finalValue = as + ds
    let finalCursor = as.length

    //* Ajuste da posição do cursor
    const newCursorChar = finalValue.charAt(finalCursor)
    if (cursorChar === newCursorChar && ['.', ','].includes(cursorChar)) {
      finalCursor++
    }

    //* Ajuste de posição da vírgula
    let posVirgula = finalValue.indexOf(',')
    if (digAposVirgula > 0) {
      // inserir ou verificar se qntd apos a virgula está correta
      if (posVirgula !== -1) {
        // tem virgula
        let tam = posVirgula + 1 + digAposVirgula
        finalValue = finalValue.slice(0, tam).padEnd(tam, '0')
      } else {
        // não tem virgula
        finalValue = finalValue + ',' + '0'.repeat(digAposVirgula)
      }
    } else if (digAposVirgula === 0 && posVirgula >= 0) {
      // existe virgula e deve ser removida junto com decimais
      finalValue = finalValue.slice(0, posVirgula)
    }

    return [finalValue, finalCursor]
  }

  /** Trata as entradas de caracteres feitas pelo usuário após terem sido inseridas no input.value (apenas /[0-9,.]/)
   *  @param {InputEvent} e
   */
  function onInput(e) {
    // return console.log(e.inputType)
    // if (e.inputType !== 'insertText') return
    // inputType: "insertFromPaste" | "insertText" | "insertFromDrop"
    /** @type {HTMLInputElement} */
    const input = e.target
    const initialValue = input.value
    const initialCursorPos = Math.max(input.selectionStart, input.selectionEnd)
    let finalValue, finalCursorPos
    if (e.inputType !== 'deleteByDrag') {
      const mask = maskMoeda(initialValue, initialCursorPos, qntdAposVirgula)
      finalValue = mask[0]
      finalCursorPos = mask[1]
      if (['deleteByCut', 'deleteContentBackward'].includes(e.inputType)) {
        if (['.', ','].includes(finalValue.charAt(finalCursorPos - 1))) {
          finalCursorPos--
        }
      } else if (e.inputType == 'deleteContentForward') {
        if (['.', ','].includes(finalValue.charAt(finalCursorPos))) {
          finalCursorPos++
        }
      }
    } else {
      return
    }

    value = parseFloat(finalValue.replaceAll('.', '').replace(',', '.')) || 0
    input.value = finalValue
    input.setSelectionRange(finalCursorPos, finalCursorPos)
  }
  /** Impede a entrada de caracteres diferentes de [0123456789.,]
   *  @param {InputEvent} e
   */
  function onBeforeInput(e) {
    if (typeof e.data == 'string') {
      for (const char of e.data) {
        const code = char.charCodeAt(0)
        if (!((code >= 48 && code <= 57) || code === 44 || code === 46)) {
          e.preventDefault()
          return
        }
      }
    }
  }

  export let value = undefined
  if (typeof value == 'string') value = value ? parseFloat(value) : undefined
  export let qntdAposVirgula = undefined

  /** @type {HTMLInputElement} */
  let maskInput

  onMount(() => {
    maskInput.onbeforeinput = onBeforeInput
    maskInput.value = value === undefined ? formatMoeda(0, qntdAposVirgula) : formatMoeda(value, qntdAposVirgula)
  })
  $: console.log({ mask: maskInput?.value, value })
</script>

<input bind:this={maskInput} type="text" class={'input '} id={'InputMask'} on:input={onInput} />
<br /><br />
<input type="hidden" bind:value />
