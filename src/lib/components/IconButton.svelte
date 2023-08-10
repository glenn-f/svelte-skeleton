<script>
  import Icon from '@iconify/svelte'
  export let icon = 'fa6-solid:circle-info'
  export let iconClass = undefined
  export let href = undefined
  export let width = undefined,
    height = undefined
  $: classNames = (iconClass ?? '') + ' hover:text-primary-500-400-token transition-all'
</script>

{#if href}
  <a {...$$restProps} {href} on:click>
    <Icon {width} {height} {icon} class={classNames} />
  </a>
{:else}
  <button {...$$restProps} on:click>
    <Icon {width} {height} {icon} class={classNames} />
  </button>
{/if}
