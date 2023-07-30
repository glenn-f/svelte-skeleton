<script>
  import { HTMLdateToMillis, millisToHTMLdate } from '$lib/types'
  import Label from './Label.svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext, onMount } from 'svelte'
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
  export let max = '9999-12-31'
  export let min = undefined
  export let readonly = undefined
  export let input = undefined
  let valueMask = undefined

  if (max instanceof Date) {
    max = max.toISOString().substring(0, 10)
  } else if (typeof max == 'string') {
    max = max.substring(0, 10)
  }

  if (min instanceof Date) {
    min = min.toISOString().substring(0, 10)
  } else if (typeof min == 'string') {
    min = min.substring(0, 10)
  }

  function updateValue(mask) {
    const tmpVal = HTMLdateToMillis(mask)
    if (tmpVal !== value) {
      value = tmpVal
    }
  }

  function updateMask(val) {
    const tmpMask = millisToHTMLdate(val)
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

  onMount(() => {
    updateMask(value)
  })
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    bind:this={input}
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="date"
    class={'input read-only:variant-filled-surface' + inputClass}
    name={'_InputDate-' + name}
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
