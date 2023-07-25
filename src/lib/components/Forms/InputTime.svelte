<script>
  import { HTMLtimeToMillis, millisToHTMLtime } from '$lib/types'
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
  export let max = undefined
  export let min = undefined
  export let readonly = undefined
  export let input = undefined
  let valueMask = undefined

  function updateValue(mask) {
    const tmpVal = HTMLtimeToMillis(mask)
    if (tmpVal !== value) {
      value = tmpVal
    }
  }

  function updateMask(val) {
    const tmpMask = millisToHTMLtime(val)
    if (tmpMask !== valueMask) {
      valueMask = tmpMask
    }
    updateContext(val)
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
  //* atualizar a mask quando value for alterado (onMount)
  $: updateMask(value)
  //* atualizar value quando a mask for alterada
  $: updateValue(valueMask)
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    bind:this={input}
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="time"
    class={'input read-only:variant-filled-surface' + inputClass}
    name={'_InputTime-' + name}
    {max}
    {min}
    {readonly}
    {autocomplete}
    {placeholder}
    {required}
    bind:value={valueMask}
  />
  <input type="hidden" {name} bind:value />
</Label>
