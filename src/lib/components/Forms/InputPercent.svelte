<script>
  import { formatMoeda } from '$lib/helpers'
  import { onMount } from 'svelte'
  import Label from './Label.svelte'
  import Icon from '@iconify/svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext } from 'svelte'
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
  /** @type {?string} */
  export let casasDecimais = 0
  export let readonly = undefined
  export let autocomplete = 'off'
  export let label = undefined
  export let required = undefined
  export let name
  export let value = undefined

  if (typeof value == 'string') {
    let v = parseFloat(value)
    value = Number.isFinite(v) ? v : undefined
  }

  function handleMask(text, selEnd) {
    if (!text) return { numJs: undefined, numBr: '', pos: 0 }
    let posFromEnd = text.length - selEnd
    text = '0' + text.replace(/[.,]/g, '')
    const numJs = casasDecimais > 0 ? parseFloat(text.slice(0, -casasDecimais) + '.' + text.slice(-casasDecimais)) : parseFloat(text)
    const numBr = formatMoeda(numJs, casasDecimais)
    const pos = numBr.length - posFromEnd
    return { numJs, numBr, pos }
  }

  /** Impede a entrada de caracteres diferentes de [0123456789.,]
   *  @param {InputEvent} e */
  function onBeforeInput(e) {
    /** @type {HTMLInputElement} */
    const inputEl = e.target
    let selSize = inputEl.selectionEnd - inputEl.selectionStart
    let selStart = Math.max(inputEl.selectionStart + (selSize === 0 && e.inputType === 'deleteContentBackward' ? -1 : 0), 0)
    let selEnd = Math.min(inputEl.selectionEnd + (selSize === 0 && e.inputType === 'deleteContentForward' ? 1 : 0), inputEl.value.length)
    let textoDelecao = inputEl.value.substring(selStart, selEnd)
    let textoInsercao = e.data || ''
    let textoAntes = inputEl.value.substring(0, selStart)
    let textoDepois = inputEl.value.substring(selEnd)
    let textoFinal = textoAntes + textoInsercao + textoDepois
    let charSelStart = inputEl.value.charAt(selStart)

    //* Tratamento de Exceções
    if (textoInsercao) {
      for (const char of textoInsercao) {
        const code = char.charCodeAt(0)
        if (!((code >= 48 && code <= 57) || code === 44 || code === 46)) return e.preventDefault()
      }
      if (!textoDelecao && textoInsercao.length == 1) {
        if (textoInsercao === charSelStart && [',', '.'].includes(charSelStart)) {
          inputEl.setSelectionRange(selStart + 1, selStart + 1)
          return e.preventDefault()
        }
      }
    } else if (textoDelecao.length == 1) {
      if ([',', '.'].includes(textoDelecao)) {
        if (e.inputType == 'deleteContentBackward') inputEl.setSelectionRange(selStart, selStart)
        else inputEl.setSelectionRange(selEnd, selEnd)
        return e.preventDefault()
      }
    }
    //* Tratamento do valor final
    let { numJs, numBr, pos } = handleMask(textoFinal, textoAntes.length + textoInsercao.length)
    value = Number.isFinite(numJs) ? numJs / 100 : numJs
    inputEl.value = numBr
    inputEl.setSelectionRange(pos, pos)
    e.preventDefault()
  }
  /** Seleciona todo o texto ao entrar no input
   * @param {InputEvent} e
   */
  function onFocus(e) {
    /** @type {HTMLInputElement} */
    const input = e.target
    let posSel = input.value.indexOf(',')
    posSel = posSel === -1 ? input.selectionEnd : posSel
    input.setSelectionRange(0, 100)
  }
  /** @type {HTMLInputElement} */
  let maskInput

  onMount(() => {
    maskInput.onbeforeinput = onBeforeInput
    onChangeValue(value)
  })

  function onChangeValue(v) {
    if (!maskInput) return
    v = parseFloat(v)
    let mask = Number.isFinite(v) ? formatMoeda(v * 100, casasDecimais) : ''
    if (mask !== maskInput.value) {
      maskInput.value = mask
    }
    updateContext(v)
  }

  const formStore = getContext('formStore')

  if (isSvelteStore(formStore)) {
    value = $formStore[name]
  }

  function updateContext(value) {
    if (isSvelteStore(formStore)) {
      $formStore[name] = value
    }
  }

  export let onKeyEnter = () => null

  function keydown(e) {
    if (e.key == 'Enter') {
      onKeyEnter()
    }
  }

  $: onChangeValue(value)
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <div class="input-group flex">
    <input
      bind:this={maskInput}
      class:input-success={success && !warning && !error}
      class:input-warning={warning && !error}
      class:input-error={error}
      type="text"
      class={'input read-only:variant-filled-surface rounded-tr-none rounded-br-none ' + inputClass}
      id={'InputMoeda' + name}
      style={`text-align: ${align};`}
      on:keydown={keydown}
      {readonly}
      {required}
      {autocomplete}
      on:focus={onFocus}
    />
    <span class="grid border-l-[1px] border-surface-400-500-token place-items-center px-1 input-group-shim">
      <Icon icon={'mdi:percent'} width="24px" height="24px" />
    </span>
  </div>
</Label>
<input type="hidden" {name} bind:value />
