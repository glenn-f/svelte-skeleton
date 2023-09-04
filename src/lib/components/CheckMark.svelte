<script>
  import Icon from '@iconify/svelte'
  export let width = '20px'
  export let height = '20px'
  export let showPercentLabel = false
  export let percent = 0
  $: percent_text = Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(percent * 100)
</script>

<div class="inline-flex gap-1 whitespace-nowrap">
  {#if percent >= 1}
    <Icon icon="mdi:checkbox-marked" {width} {height} color="rgb(var(--color-primary-600))" />
  {:else if percent > 0}
    <Icon icon="mdi:minus-box" {width} {height} color="rgb(var(--color-warning-600))" />
  {:else}
    <Icon icon="mdi:close-box" {width} {height} color="rgb(var(--color-error-600))" />
  {/if}
  {#if showPercentLabel}
    {percent_text}%
  {/if}
</div>
