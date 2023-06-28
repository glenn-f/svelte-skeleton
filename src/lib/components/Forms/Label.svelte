<script>
  import HelperMessage from './HelperMessage.svelte'

  export let labelClass = ''
  /** @type {?string} */
  export let label = ''
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?(string | string[])} */
  export let error = undefined
  /** @type {?string} */
  export let warning = undefined
  /** @type {?string} */
  export let success = undefined
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
</script>

<label class={'label ' + labelClass}>
  <!-- Label + Required Indicator (*) -->
  <span>
    {label}
    {#if label && (required === '' || Boolean(required))}
      <span class="text-red-400">&nbsp;*</span>
    {/if}
  </span>
  <!-- Input -->
  <slot />
  <!-- Error / Warning / Success Message -->
  <HelperMessage {error} {warning} {success} spaceHolding={errorSpacing} />
</label>
