<script>
  import { Table } from '$lib/components/Table'
  import { mapCondicao, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  export let data

  $: rows = data.estoques || []
  let columns = [
    { accessorKey: 'data_venda', header: 'Data Venda', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'vendedor', header: 'Vendedor' },
    { accessorKey: 'produto', header: 'Produto' },
    { accessorKey: 'condicao', header: 'Condição', cell: (info) => mapCondicao.get(info.getValue()) },
    { accessorKey: 'origem', header: 'Origem', cell: (info) => mapOrigem.get(info.getValue()) },
    { accessorKey: 'qntd_venda', header: 'Qntd' },
    { accessorKey: 'preco_unit', header: 'Preço Unit.', cell: (info) => formatMoeda(info.row.original.preco_total / info.row.original.qntd_venda) },
    { accessorKey: 'preco_total', header: 'Preço Total', cell: (info) => formatMoeda(info.getValue()) },
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'observacoes', header: 'Observações' }
  ]
  const pageSizes = [10, 25, 50]
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Histórico de Vendas</h1>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table {rows} {columns} {pageSizes} />
    {/key}
  </div>
</div>
