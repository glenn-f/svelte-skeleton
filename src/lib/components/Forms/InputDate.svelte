<script>
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
  /** @type {?string} */
  export let autocomplete = 'off'
  export let max = '9999-12-31'
  export let min
  export let readonly = undefined
  export let input = undefined

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
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    bind:this={input}
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="date"
    class={'input read-only:variant-filled-surface' + inputClass}
    {max}
    {min}
    {readonly}
    {autocomplete}
    {placeholder}
    {name}
    {required}
    bind:value
  />
</Label>
