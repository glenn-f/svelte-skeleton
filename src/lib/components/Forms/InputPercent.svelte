<script>
  import { formatMoeda } from '$lib/helpers'
  import { onMount } from 'svelte'
  import Label from './Label.svelte'
  import Icon from '@iconify/svelte'

  const verificarZerosEsquerda = (val) => {
    const match = /^([0\.]+)(?=\d)/g.exec(val)
    return match ? (match[1] || '').length : 0
  }
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
    let virgula = 0
    /** Contador de milhar no texto da máscara (-1: indefinido) */
    let milhar = initialValue.indexOf(',') === -1 ? 0 : -1
    let maskInfo

    //* Depois do cursor
    maskInfo = maskLoop(lastCharPos, initialValue, selPos, virgula, milhar)
    ds = maskInfo[0]
    virgula = maskInfo[1]
    milhar = maskInfo[2]

    //* Antes do cursor
    maskInfo = maskLoop(selCharPos, initialValue, 0, virgula, milhar)
    as = maskInfo[0]
    virgula = maskInfo[1]
    milhar = maskInfo[2]

    // não pode iniciar com vírgula, deve haver um dígito à esquerda
    if (as.charAt(0) === ',') as = '0' + as
    if (!as && ds.charAt(0) === ',') ds = '0' + ds

    // apagar zeros a esquerda, se houver
    const corteAS = verificarZerosEsquerda(as + ds)
    const corteDS = verificarZerosEsquerda(ds)
    if (corteAS) {
      as = as.slice(corteAS)
    }
    if (as.length === 0 && corteDS) {
      ds = ds.slice(corteDS)
    }

    //* Resultado da máscara
    let finalValue = as + ds
    let finalCursor = as.length

    //* Ajuste da posição do cursor
    const newCursorChar = finalValue.charAt(finalCursor)
    if (cursorChar === newCursorChar && ['.', ','].includes(cursorChar)) {
      finalCursor++
    }

    //* Ajuste de dígitos após virgula
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
    // apagar virgula orfã se o último valor digitado não é uma vírgula
    if (finalValue.at(-1) === ',' && finalValue.charAt(finalCursor - 1) !== ',') {
      finalValue = finalValue.slice(0, finalValue.length - 1)
    }

    return [finalValue, finalCursor]
  }

  /** Trata as entradas de caracteres feitas pelo usuário após terem sido inseridas no input.value (apenas /[0-9,.]/)
   *  @param {InputEvent} e
   */
  function onInput(e) {
    /** @type {HTMLInputElement} */
    const input = e.target
    const initialValue = input.value
    const initialCursorPos = Math.max(input.selectionStart, input.selectionEnd)
    let finalValue, finalCursorPos
    // inputType: "insertFromPaste" | "insertText" | "insertFromDrop"
    if (e.inputType !== 'deleteByDrag') {
      const mask = maskMoeda(initialValue, initialCursorPos, qntdAposVirgula)
      finalValue = mask[0]
      finalCursorPos = mask[1]
      if (['deleteByCut', 'deleteContentBackward'].includes(e.inputType)) {
        if (['.'].includes(finalValue.charAt(finalCursorPos - 1))) {
          finalCursorPos--
        }
      } else if (e.inputType == 'deleteContentForward') {
        if (['.'].includes(finalValue.charAt(finalCursorPos)) || finalValue.slice(0, finalCursorPos + 2) == '0,') {
          finalCursorPos++
        }
      }
      if (e.data == '0' && finalCursorPos == 0 && finalValue.at(0) == '0') {
        finalCursorPos++
      }
    } else {
      return
    }

    value = parseFloat(finalValue.replaceAll('.', '').replace(',', '.')) || 0
    if (min !== undefined && value < min) {
      value = min
      input.value = minMask
      input.setSelectionRange(0, 100)
    } else if (min !== undefined && value > max) {
      value = max
      input.value = maxMask
      input.setSelectionRange(0, 100)
    } else {
      input.value = finalValue
      input.setSelectionRange(finalCursorPos, finalCursorPos)
    }
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

  /**
   *
   * @param {InputEvent} e
   */
  function onBlur(e) {
    let mask = (e.target.value ?? '0').replaceAll('.', '').replace(',', '.')
    value = parseFloat(mask)
    maskInput.value = formatMoeda(mask, qntdAposVirgula)
  }

  /**
   *
   * @param {InputEvent} e
   */
  function onFocus(e) {
    /** @type {HTMLInputElement} */
    const input = e.target
    console.log(input)
    input.setSelectionRange(0,100)
  }

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
  /** O padrão de alinhamento interno é 'right' @type {'right' | 'center' | 'left'} */
  export let align = 'right'
  export let qntdAposVirgula = 2
  export let max = 100
  let maxMask = formatMoeda(max, qntdAposVirgula)
  export let min = 0
  let minMask = formatMoeda(min, qntdAposVirgula)
  /** @type {?string} */
  export let autocomplete = 'off'
  export let label = undefined
  export let required = undefined
  export let name = undefined
  export let value = undefined
  export let readonly = undefined
  if (typeof value == 'string') value = value ? parseFloat(value) : undefined

  /** @type {HTMLInputElement} */
  let maskInput

  onMount(() => {
    maskInput.onbeforeinput = onBeforeInput
    maskInput.value = value === undefined ? formatMoeda(0, qntdAposVirgula) : formatMoeda(value, qntdAposVirgula)
  })
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <div class="input-group flex">
    <input
      bind:this={maskInput}
      class:input-success={success && !warning && !error}
      class:input-warning={warning && !error}
      class:input-error={error}
      type="text"
      class={'input read-only:variant-filled-surface ' + inputClass}
      id={'InputMoeda' + name}
      style={`text-align: ${align};`}
      {readonly}
      {required}
      {autocomplete}
      on:input={onInput}
      on:blur={onBlur}
      on:focus={onFocus}
    />
    <span class='grid border-l-[1px] border-surface-400-500-token place-items-center px-1 input-group-shim'>
      <Icon icon={"mdi:percent"} width="24px" height="24px" />
    </span>
  </div>
</Label>
<input type="hidden" {name} bind:value />
