<script>
  export let label = undefined
  export let width = 'w-full'
</script>

<fieldset class={`rounded-md border p-1 px-2 bg-surface-50-900-token border-surface-400-500-token ${width}`}>
  {#if $$slots.label || label}
    <legend class="px-1 text-xs">
      <b class="flex">
        {#if $$slots.label}
          <slot name="label" />
        {:else}
          {label}
        {/if}
      </b>
    </legend>
  {/if}
  <slot />
</fieldset>
