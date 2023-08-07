<script>
  import Icon from '@iconify/svelte'

  export let loading = undefined
  export let icon = undefined
  export let iconRight = undefined
  export let text = undefined
  export let loadingText = undefined
  export let iconClass = ''
  export let iconRightClass = ''
  export let textClass = ''
</script>

{#if loading}
  <Icon icon="line-md:loading-twotone-loop" />
  <span>{loadingText ?? ''}</span>
{:else}
  {#if icon}
    <span><Icon {icon} class={iconClass} /></span>
  {/if}
  <b class={textClass}>{text ?? ''}</b>
  {#if iconRight}
    <span><Icon icon={iconRight} class={iconRightClass} /></span>
  {/if}
{/if}
