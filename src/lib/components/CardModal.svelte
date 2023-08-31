<script>
  export let width = 'w-modal'
  export let padding = 'p-2 pt-0'
  $: classNames = `card gap-2 ${width} ${padding} h-min`
</script>

<div class={classNames}>
  {#if $$slots.header}
    <div class="card-header flex justify-center gap-2">
      <slot name="header" />
    </div>
    <hr class="my-2" />
  {/if}
  <div class="overflow-y-auto max-h-[80vh]">
    <slot />
  </div>
  {#if $$slots.footer}
    <hr class="my-2" />
    <div class="card-footer flex justify-center gap-2">
      <slot name="footer" />
    </div>
  {/if}
</div>
