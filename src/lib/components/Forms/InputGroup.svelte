<fieldset class="rounded-md border p-1 px-2 bg-surface-50-900-token border-surface-400-500-token w-full">
  {#if $$slots.label}
    <legend class="px-1 text-xs">
      <b class="flex">
        <slot name="label" />
      </b>
    </legend>
  {/if}
  <slot />
</fieldset>
