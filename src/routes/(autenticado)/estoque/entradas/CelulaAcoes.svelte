<script>
  import IconButton from '$lib/components/IconButton.svelte'
  export let data
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton href={`/estoque/entradas/${data.id}`} icon="fa6-solid:eye">Ver Detalhes</IconButton>
</div>
