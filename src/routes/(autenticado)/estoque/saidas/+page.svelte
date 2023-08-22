<script>
  import { Table } from '$lib/components/Table'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import Icon from '@iconify/svelte'
  import { mapProcessoEstoque } from '$lib/globals'
  import ShowChip from '$lib/components/ShowChip.svelte'
  export let data

  $: rows = data.entradas || []
  let columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'criacao', header: 'Data Saída', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'tipo_pe', header: 'Processo de Estoque', cell: (info) => renderComponent(ShowChip, { text: mapProcessoEstoque.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'responsavel', header: 'Responsável' },
    { accessorKey: 'participante', header: 'Cliente' },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { data: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Saídas</h1>
    <a class="btn variant-filled-primary h-min" href="/estoque/saidas/adicionar">
      <Icon icon="fa6-solid:arrow-up-right-from-square" />
      <span>Adicionar</span>
    </a>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table {rows} {columns} {pageSizes} />
    {/key}
  </div>
</div>
