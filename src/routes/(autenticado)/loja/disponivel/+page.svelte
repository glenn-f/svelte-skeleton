<script>
  import { Table } from '$lib/components/Table'
  import { mapCondicao, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ShowChip from '$lib/components/ShowChip.svelte'
  export let data

  $: rows = data.estoques || []
  let columns = [
    { accessorKey: 'forma_entrada', header: 'Forma Entrada', cell: (info) => mapFluxoEstoque.get(info.getValue()) },
    { accessorKey: 'qntd', header: 'Qntd' },
    { accessorKey: 'produto', header: 'Produto' },
    { accessorKey: 'preco_unitario', header: 'Preço Unit.', cell: (info) => formatMoeda(info.getValue()) },
    { accessorKey: 'condicao', header: 'Condição', cell: (info) => renderComponent(ShowChip, { text: mapCondicao.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'origem', header: 'Origem', cell: (info) => renderComponent(ShowChip, { text: mapOrigem.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'observacoes', header: 'Observações' },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { data: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Estoque Disponível</h1>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table {rows} {columns} {pageSizes} />
    {/key}
  </div>
</div>
