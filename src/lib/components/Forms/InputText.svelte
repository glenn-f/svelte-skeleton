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
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <input
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="text"
    class={'input ' + inputClass}
    {placeholder}
    {name}
    {required}
    bind:value
  />
</Label>
