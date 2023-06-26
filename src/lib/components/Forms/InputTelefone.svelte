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
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
  const maskData = {
    [8]: { mask: '(__) ____-____', tam: 10, pos: [0, 2, 2, 6] },
    [9]: { mask: '(__) _ ____-____', tam: 11, pos: [0, 2, 2, 3, 7] }
  }

  let tmpMask = maskData[8]
  let maskValue = value ? toTelMask(value.toString()) : tmpMask.mask
  let inputMasked, selectionPos

  function mask(event) {
    let inputText = event.target.value.replace(/\D/g, '')
    tmpMask = inputText.length <= maskData[8].tam ? maskData[8] : maskData[9]
    inputText = inputText.slice(0, tmpMask.tam)
    if (event.inputType == 'insertText') {
      let selectionSlicedValue = event.target.value.slice(0, event.target.selectionStart).replace(/\D/g, '')
      let selectionStart = Math.min(inputText.length, selectionSlicedValue.length)
      selectionStart += selOffSet(selectionStart)
      const maskedText = toTelMask(inputText)
      //*
      selectionPos = selectionStart
      maskValue = maskedText
      value = inputText
    } else {
      selectionPos = event.target.selectionStart
      value = inputText
      console.log(event.inputType)
    }
  }

  function selOffSet(length) {
    let offset = 0
    for (let pos of tmpMask.pos) {
      if (length >= pos) offset++
      else break
    }
    return offset
  }

  function toTelMask(text) {
    let textValue = text.replace(/\D/g, '').slice(0, tmpMask.tam)
    let maskedValue = ''
    const telMask = tmpMask.mask

    for (let i = 0, j = 0; i < telMask.length; i++) {
      if (j < textValue.length) {
        if (telMask[i] == '_' && /\d/g.test(textValue[j])) {
          maskedValue += textValue[j]
          j++
        } else {
          maskedValue += telMask[i]
        }
      } else {
        maskedValue += telMask.slice(maskedValue.length)
      }
    }
    return maskedValue
  }

  function blurMask(event) {
    let inputText = event.target.value.replace(/\D/g, '')
    tmpMask = inputText.length <= maskData[8].tam ? maskData[8] : maskData[9]
    inputText = inputText.slice(0, tmpMask.tam)
    const maskedText = toTelMask(inputText)
    maskValue = maskedText
    value = inputText
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
    id={'InputMask' + name}
    {placeholder}
    {required}
    on:input={mask}
    on:blur={blurMask}
    bind:value={maskValue}
  />
  <input type="hidden" {name} bind:value />
</Label>
