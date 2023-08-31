<script>
  import { createEventDispatcher } from 'svelte'
  import ButtonInner from './ButtonInner.svelte'
  const dispatch = createEventDispatcher()

  function onClick(event) {
    dispatch('click', event)
  }

  export let icon = undefined
  export let iconRight = undefined
  export let loading = undefined
  export let disabled = undefined
  export let iconClass = undefined
  export let iconRightClass = undefined
  export let textClass = undefined
  export let text
  export let loadingText = 'Carregando...'
  export let href = undefined
  export let type = 'button'
  export let target = undefined
  $: classes = `btn variant-filled ${$$restProps.class ?? ''}`
  $: href = disabled ? undefined : href
  $: text = text ? text.toUpperCase() : ''
</script>

<!-- <input type="text" class="input" /> -->
{#if href === undefined}
  <button {...$$restProps} {type} on:click={onClick} disabled={disabled || loading} class={classes}>
    <ButtonInner {icon} {iconRight} {iconClass} {iconRightClass} {loading} {loadingText} {text} {textClass} />
  </button>
{:else}
  <a {...$$restProps} {href} {target} class={classes}>
    <ButtonInner {icon} {iconRight} {iconClass} {iconRightClass} {loading} {loadingText} {text} {textClass} />
  </a>
{/if}
