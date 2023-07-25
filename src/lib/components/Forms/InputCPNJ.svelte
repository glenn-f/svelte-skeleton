<script>
  import { afterUpdate } from 'svelte'
  import Label from './Label.svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext } from 'svelte'

  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?string} */
  export let placeholder = undefined
  /** @type {?string} */
  export let name = undefined
  /** @type {?any} */
  export let value = undefined
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
  /** @type {?string} */
  export let autocomplete = 'off'
  export let readonly = undefined
  const maskData = { mask: '__.___.___/____-__', tam: 14, pos: [2, 5, 8, 12] }
  let maskValue = value ? toCNPJMask(value.toString()) : maskData.mask
  let inputMasked, selectionPos

  function mask(event) {
    let inputText = event.target.value.replace(/\D/g, '').slice(0, maskData.tam)
    if (event.inputType == 'insertText') {
      let selectionSlicedValue = event.target.value.slice(0, event.target.selectionStart).replace(/\D/g, '')
      let selectionStart = Math.min(inputText.length, selectionSlicedValue.length)
      selectionStart += selOffSet(selectionStart)
      const maskedText = toCNPJMask(inputText)
      //*
      selectionPos = selectionStart
      maskValue = maskedText
      value = inputText
    } else {
      selectionPos = event.target.selectionStart
      value = inputText
    }
  }
  function selOffSet(length) {
    let offset = 0
    for (let pos of maskData.pos) {
      if (length >= pos) offset++
      else break
    }
    return offset
  }

  function toCNPJMask(text) {
    let textValue = text.replace(/\D/g, '').slice(0, maskData.tam)
    let maskedValue = ''
    const cnpjMask = maskData.mask

    for (let i = 0, j = 0; i < cnpjMask.length; i++) {
      if (j < textValue.length) {
        if (cnpjMask[i] == '_' && /\d/g.test(textValue[j])) {
          maskedValue += textValue[j]
          j++
        } else {
          maskedValue += cnpjMask[i]
        }
      } else {
        maskedValue += cnpjMask.slice(maskedValue.length)
      }
    }
    return maskedValue
  }

  function blurMask(event) {
    let inputText = event.target.value.replace(/\D/g, '').slice(0, maskData.tam)
    const maskedText = toCNPJMask(inputText)
    maskValue = maskedText
    value = inputText
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
  $: updateContext(value)

  afterUpdate(() => {
    inputMasked.setSelectionRange(selectionPos, selectionPos)
  })
  $: if (readonly) {
    const [maskedText, unmaskedText] = toCNPJMask(maskData.mask, maskValue)
    console.log({ value, unmaskedText, maskValue })
    if (unmaskedText != value) {
      const [_masked, _value] = toCNPJMask(maskData.mask, value)
      maskValue = _masked
    }
  }
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    bind:this={inputMasked}
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="text"
    class={'input read-only:variant-filled-surface ' + inputClass}
    id={'InputMask' + name}
    {readonly}
    {autocomplete}
    {placeholder}
    {required}
    on:input={mask}
    on:blur={blurMask}
    bind:value={maskValue}
  />
  <input type="hidden" {name} bind:value />
</Label>
