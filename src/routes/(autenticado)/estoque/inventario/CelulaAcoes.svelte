<script>
  import IconButton from '$lib/components/IconButton.svelte'
  export let data
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton href={`/loja/vender?eid=${data.id ?? ''}`} icon="mdi:point-of-sale" width='20px' height='20px'>Iniciar Venda</IconButton>
  <IconButton href={`/estoque/inventario/${data.id ?? ''}`} icon="fa6-solid:eye" width='20px' height='20px'>Ver Detalhes</IconButton>
  <IconButton href={`/estoque/entradas/${data.entrada_id ?? ''}`} icon="ri:inbox-archive-fill" width='20px' height='20px'>Abrir Entrada</IconButton>
</div>
