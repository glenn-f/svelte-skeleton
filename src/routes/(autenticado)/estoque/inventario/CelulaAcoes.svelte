<script>
  import { page } from '$app/stores'
  import IconButton from '$lib/components/IconButton.svelte'
  import { EE_DISPONIVEL } from '$lib/globals'
  export let data
  $: iniciarVendaDisabled = data.estado !== EE_DISPONIVEL ? true : undefined
</script>

<div class="flex flex-nowrap gap-3">
  {#if $page.data.sessao?.gpe?.pode_iniciar_venda}
    <IconButton disabled={iniciarVendaDisabled} href={`/loja/vender?eid=${data.id ?? ''}`} icon="mdi:point-of-sale" width="20px" height="20px" data-tooltip="Iniciar Venda" data-placement="left" />
  {/if}
  {#if $page.data.sessao?.gpe?.pode_entrada_estoque}
    <IconButton href={`/estoque/inventario/${data.id ?? ''}`} icon="fa6-solid:eye" width="20px" height="20px" data-tooltip="Ver Detalhes" data-placement="left" />
  {/if}
  {#if $page.data.sessao?.gpe?.pode_entrada_estoque}
    <IconButton href={`/estoque/entradas/${data.entrada_id ?? ''}`} icon="ri:inbox-archive-fill" width="20px" height="20px" data-tooltip="Abrir Entrada" data-placement="left" />
  {/if}
</div>
