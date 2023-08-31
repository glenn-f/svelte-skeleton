<script>
  import IconButton from '$lib/components/IconButton.svelte'
  export let data
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton href={`/estoque/saidas/${data.id}`} icon="fa6-solid:eye" data-tooltip="Ver Detalhes" data-placement="left" />
</div>
