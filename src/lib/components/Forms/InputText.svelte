<script>
  import Label from './Label.svelte'

  /** @type {?string} */
  export let label
  /** @type {any} */
  export let required = undefined
  /** @type {?string} */
  export let placeholder
  /** @type {?string} */
  export let name
  /** @type {?any} */
  export let value
  /** @type {?(string | string[])} */
  export let error
  /** @type {?string} */
  export let warning
  /** @type {?string} */
  export let success
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
  /** @type {?string} */
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass}>
  <input class:input-success={success && !warning && !error} class:input-warning={warning && !error} class:input-error={error} type="text" class={'input ' + inputClass} {placeholder} {name} bind:value />
</Label>
