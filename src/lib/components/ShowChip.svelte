<script>
  const colors = {
    [0]: 'variant-filled',
    [1]: 'variant-soft-success',
    [2]: 'variant-soft-tertiary',
    [3]: 'variant-soft-warning',
    [4]: 'variant-soft-error',
    [5]: 'variant-soft-primary',
    [6]: 'variant-soft-secondary',
    [7]: 'variant-ghost-tertiary',
    [8]: 'variant-ghost-surface',
    [9]: 'variant-ghost-primary'
  }
  export let text = undefined
  export let value = 1
  let color = ''
  $: hash = (parseInt(value) || 0) % 10
  $: color = colors[hash]
</script>

<span class={`p-1 chip pointer-events-none ${color}`}>{text ?? ''}</span>
