<script context="module">
  let id = 0
</script>

<script>
  import Tooltip from '$lib/components/Tooltip.svelte'
  import Icon from '@iconify/svelte'
  import { popup } from '@skeletonlabs/skeleton'

  export let icon = 'fa6-solid:circle-info'
  export let iconClass = 'hover:text-primary-500-400-token'
  export let tooltipPlacement = 'top'
  export let href = undefined
  export let width = undefined, height = undefined, title = undefined

  const target = 'IconButton' + id++

  $: popupSettings = { event: 'hover', target, placement: tooltipPlacement }
</script>

{#key $$slots.default}
  {#if href}
    <a {...$$props} {href} on:click use:popup={popupSettings} {title}>
      <Icon {width} {height} {icon} class={iconClass} />
    </a>
  {:else}
    <button {...$$props} on:click use:popup={popupSettings} {title}>
      <Icon {width} {height} {icon} class={iconClass} />
    </button>
  {/if}
  {#if $$slots.default}
    <Tooltip id={target}>
      <slot />
    </Tooltip>
  {/if}
{/key}
