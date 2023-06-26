<script>
  import InputCPF from './InputCPF.svelte'
  /**
   * Recebe uma string numérica com ou sem máscara e retorna a nova máscara de texto e a posição do cursor de seleção textual
   * @param {string} initialValue
   * @param {number} selPos
   */
  function handleMaskedValue(initialValue, selPos, qntdAposVirgula = null) {
    qntdAposVirgula = Number.isInteger(qntdAposVirgula) && qntdAposVirgula >= 0 ? qntdAposVirgula : -1
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
    let milharCount = -1

    //* Depois do cursor
    for (let i = lastCharPos, c = initialValue.charAt(lastCharPos); i >= selPos; i--, c = initialValue.charAt(i)) {
      const éVírgula = c === ','
      const éPonto = c === '.'
      if (éVírgula) {
        if (!virgularEncontrada) {
          milharCount = 0
          virgularEncontrada = 1
          ds = ',' + ds
        }
        continue
      } else if (éPonto) {
        if (milharCount > 0 && milharCount % 3 === 0) {
          milharCount = 0
          ds = '.' + ds
        }
        continue
      }
      if (milharCount > 0 && milharCount % 3 === 0) ds = '.' + ds
      ds = c + ds
      if (milharCount > -1) milharCount += 1
    }

    //* Antes do cursor
    for (let i = selCharPos, c = initialValue.charAt(selCharPos); i >= 0; i--, c = initialValue.charAt(i)) {
      const éVírgula = c === ','
      const éPonto = c === '.'
      if (éVírgula) {
        if (!virgularEncontrada) {
          milharCount = 0
          virgularEncontrada = -1
          as = ',' + as
        }
        continue
      } else if (éPonto) {
        if (milharCount > 0 && milharCount % 3 === 0) {
          milharCount = 0
          as = '.' + as
        }
        continue
      }
      if (milharCount > 0 && milharCount % 3 === 0) as = '.' + as
      as = c + as
      if (milharCount > -1) milharCount += 1
    }

    let finalValue = as + ds
    let finalCursor = as.length
    const newCursorChar = finalValue.charAt(finalCursor)
    if (cursorChar === newCursorChar && ['.', ','].includes(cursorChar)) finalCursor++

    let posVirgula = finalValue.indexOf(',')
    if (qntdAposVirgula > 0) {
      // inserir ou verificar se qntd apos a virgula está correta
      if (posVirgula !== -1) {
        //tem virgula
        finalValue = finalValue.slice(0, posVirgula + 1 + qntdAposVirgula).padEnd(posVirgula + 1 + qntdAposVirgula, '0')
      } else {
        //não tem virgula
        finalValue = finalValue + ',' + '0'.repeat(qntdAposVirgula)
      }
    } else if (qntdAposVirgula === 0 && posVirgula >= 0) {
      //existe virgula e deve ser removida junto com decimais
      finalValue = finalValue.slice(0, posVirgula)
    }
    return [finalValue, finalCursor]
  }

  /** Trata as entradas de caracteres feitas pelo usuário após terem sido inseridas no input.value (apenas /[0-9,.]/)
   *  @param {InputEvent} e
   */
  function onInput(e) {
    if (e.inputType !== 'insertText') return
    // inputType: "insertFromPaste" | "insertText" | "insertFromDrop"
    /** @type {HTMLInputElement} */
    const input = e.target
    const initialValue = input.value
    const initialCursor = Math.max(input.selectionStart, input.selectionEnd)
    const [finalValue, finalCursor] = handleMaskedValue(initialValue, initialCursor, 3) 
    const value = parseFloat(finalValue.replaceAll('.','').replace(',','.')) || 0
    console.log(value)
    input.value = finalValue
    input.setSelectionRange(finalCursor, finalCursor)
  }
  /** Impede a entrada de caracteres diferentes de [0123456789.,]
   *  @param {InputEvent} e
   */
  function onBeforeUpdate(e) {
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
  /** @type {HTMLInputElement} */
  let maskInput
  $: if (maskInput) maskInput.onbeforeinput = onBeforeUpdate
</script>

<input bind:this={maskInput} type="text" class={'input '} id={'InputMask'} on:input={onInput} />
<br /><br />
<input type="text" class={'input '} />
