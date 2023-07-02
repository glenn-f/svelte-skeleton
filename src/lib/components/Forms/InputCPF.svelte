<script>
  import { afterUpdate } from 'svelte'
  import Label from './Label.svelte'

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
  export let autocomplete = 'off'
  /** @type {?string} */
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
  export let readonly = undefined
  const maskData = { mask: '___.___.___-__', tam: 11, pos: [3,6,9] }
  let maskValue = value ? toCPFMask(value.toString()) : maskData.mask
  let inputMasked, selectionPos

  function mask(event) {
    let inputText = event.target.value.replace(/\D/g, '').slice(0, maskData.tam)
    if (event.inputType == 'insertText') {
      let selectionSlicedValue = event.target.value.slice(0, event.target.selectionStart).replace(/\D/g, '')
      let selectionStart = Math.min(inputText.length, selectionSlicedValue.length)
      selectionStart += selOffSet(selectionStart)
      const maskedText = toCPFMask(inputText)
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

  function toCPFMask(text) {
    let textValue = text.replace(/\D/g, '').slice(0, maskData.tam)
    let maskedValue = ''
    const cpfMask = maskData.mask

    for (let i = 0, j = 0; i < cpfMask.length; i++) {
      if (j < textValue.length) {
        if (cpfMask[i] == '_' && /\d/g.test(textValue[j])) {
          maskedValue += textValue[j]
          j++
        } else {
          maskedValue += cpfMask[i]
        }
      } else {
        maskedValue += cpfMask.slice(maskedValue.length)
      }
    }
    return maskedValue
  }

  function blurMask(event) {
    let inputText = event.target.value.replace(/\D/g, '').slice(0, maskData.tam)
    const maskedText = toCPFMask(inputText)
    maskValue = maskedText
    value = inputText
  }

  afterUpdate(() => {
    inputMasked.setSelectionRange(selectionPos, selectionPos)
  })
  $: if (readonly) {
    const [maskedText, unmaskedText] = toCPFMask(maskData.mask, maskValue)
    console.log({ value, unmaskedText, maskValue })
    if (unmaskedText != value) {
      const [_masked, _value] = toCPFMask(maskData.mask, value)
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
    {autocomplete}
    class={'input read-only:variant-filled-surface ' + inputClass}
    id={'InputMask' + name}
    {readonly}
    {placeholder}
    {required}
    on:input={mask}
    on:blur={blurMask}
    bind:value={maskValue}
  />
  <input type="hidden" {name} bind:value />
</Label>
