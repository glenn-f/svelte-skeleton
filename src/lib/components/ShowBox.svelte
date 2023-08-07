<script>
  export let label = ''
  export let labelClass = ''
  export let boxClass = ''
  export let wrap = false
</script>

<div {...$$restProps} class={`${!wrap ? 'whitespace-nowrap' : ''} flex flex-col w-full ${$$restProps.class ?? ''}`}>
  <span class={'flex items-center gap-1 justify-center text-xs font-bold ' + labelClass}>
    {#if $$slots.label}
      <slot name="label" />
    {:else}
      {label}
    {/if}
  </span>
  <div class={'flex items-center gap-1 justify-center rounded-token variant-soft mt-1 py-2 px-3 spaceHolding' + boxClass}>
    <slot>(slot: default)</slot>
  </div>
</div>
