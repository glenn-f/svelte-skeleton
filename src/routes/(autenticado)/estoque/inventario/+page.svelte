<script>
    import { Table } from '$lib/components/Table'
    import { renderComponent } from '@tanstack/svelte-table'
    import CelulaAcoes from './CelulaAcoes.svelte'
    export let data
  
    $: rows = data.estoques || []
    let columns = [
        { accessorKey: 'qntd', header: 'Qntd' },
      { accessorKey: 'produto_id', header: 'Produto' },
      { accessorKey: 'preco_unitario', header: 'Preço Unit.' },
      { accessorKey: 'condicao', header: 'Condição' },
      { accessorKey: 'origem', header: 'Origem' },
      { accessorKey: 'codigo', header: 'Código' },
      { accessorKey: 'estado', header: 'Status' },
      { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original }), enableSorting: false }
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
  