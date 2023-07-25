<script>
  import HelperMessage from './HelperMessage.svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext } from 'svelte'
  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?string} */
  export let name = undefined
  /** @type {?any} */
  export let checked = undefined
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

  const formStore = getContext('formStore')

  if (isSvelteStore(formStore)) {
    checked = $formStore[name]
  }

  function updateContext(checked) {
    if (isSvelteStore(formStore)) {
      $formStore[name] = checked
    }
  }
  $: updateContext(checked)
</script>

<label class={'label flex items-center space-x-1 ' + labelClass}>
  <input
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    type="checkbox"
    class={'checkbox ' + inputClass}
    {name}
    {required}
    bind:checked
  />
  <p>
    <span class="text-xs align-text-top">
      {label}
      {#if label && (required === '' || Boolean(required))}
        <span class="text-red-400">&nbsp;*</span>
      {/if}
    </span>
  </p>
  <HelperMessage {error} {warning} {success} spaceHolding={errorSpacing} />
</label>
