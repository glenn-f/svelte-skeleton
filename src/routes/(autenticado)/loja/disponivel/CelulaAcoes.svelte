<script>
  import IconButton from '$lib/components/IconButton.svelte'
  export let data
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton href={`/loja/vender?eid=${data.id ?? ''}`} icon="mdi:point-of-sale" width="20px" height="20px" data-tooltip="Iniciar Venda" data-placement="left" />
</div>
