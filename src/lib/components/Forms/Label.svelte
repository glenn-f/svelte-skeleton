<script>
  export let labelClass = ''
  /** @type {?string} */
  export let label
  /** @type {any} */
  export let required = undefined
  /** @type {?(string | string[])} */
  export let error
  /** @type {?string} */
  export let warning
  /** @type {?string} */
  export let success
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
  let errorMsg = ''
  $: if (Array.isArray(error) && error.length > 0) {
    errorMsg = error.join(', ')
  } else if (typeof error == 'string' && error.length > 0) {
    errorMsg = error
  } else {
    errorMsg = error ? error : ''
  }
</script>

<label class={'label ' + labelClass}>
  <span>
    {label}
    {#if label && (required === '' || Boolean(required))}
      <span class="text-red-400">&nbsp;*</span>
    {/if}
  </span>
  <slot />
  {#if errorMsg}
    <span class="text-error-500">
      {errorMsg}
    </span>
  {:else if warning && typeof warning == 'string'}
    <span class="text-warning-500">
      {warning}
    </span>
  {:else if success && typeof success == 'string'}
    <span class="text-success-500">
      {success}
    </span>
  {:else if errorSpacing}
    <span>&nbsp;</span>
  {/if}
</label>
