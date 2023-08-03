<script>
  export let background = 'variant-filled-primary'
  export let padding = 'p-2'
  export let margin = 'm-0'
  export let border = ''
  export let id
</script>

<div class={`card ${padding} ${margin} ${background} ${border}`} data-popup="{id}">
  <p><slot>Tooltip text</slot></p>
  <div class={`arrow ${background} ${border}`} />
</div>
