<script>
  import Icon from '@iconify/svelte'
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
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim !px-2">
      <Icon icon="mdi:at" width="28px" height="28px" />
    </div>
    <input
      class:input-success={success && !warning && !error}
      class:input-warning={warning && !error}
      class:input-error={error}
      type="email"
      class={'read-only:variant-filled-surface ' + inputClass}
      {readonly}
      {autocomplete}
      {placeholder}
      {name}
      bind:value
      {required}
    />
  </div>
</Label>
