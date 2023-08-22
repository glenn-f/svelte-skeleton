<script>
  import { Table } from '$lib/components/Table'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import { mapCondicao, mapEstadoEstoque, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import ShowChip from '$lib/components/ShowChip.svelte'
  export let data

  $: rows = data.estoques || []
  let columns = [
    { accessorKey: 'data_entrada', header: 'Data Entrada', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'forma_entrada', header: 'Forma Entrada', cell: (info) => renderComponent(ShowChip, { text: mapFluxoEstoque.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'qntd', header: 'Qntd' },
    { accessorKey: 'p_nome', header: 'Produto' },
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'condicao', header: 'Condição', cell: (info) => renderComponent(ShowChip, { text: mapCondicao.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'origem', header: 'Origem', cell: (info) => renderComponent(ShowChip, { text: mapOrigem.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'estado', header: 'Status', cell: (info) => renderComponent(ShowChip, { text: mapEstadoEstoque.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'custo', header: 'Custo Unit.', cell: (info) => formatMoeda(info.getValue() / info.row.original.qntd) },
    { accessorKey: 'preco_unitario', header: 'Preço Unit.', cell: (info) => formatMoeda(info.getValue()) },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { data: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Inventário</h1>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table {rows} {columns} {pageSizes} />
    {/key}
  </div>
</div>
