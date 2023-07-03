<script>
  import { renderComponent } from '@tanstack/svelte-table'
  import { Table, TableActions } from '$lib/components/Table'

  let rows = [
    { id: 1, date: '2022-01-01', country: 'Hungria', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 }
  ]

  let columns = [
    { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue().toString() },
    { accessorKey: 'date', header: 'Date', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'country', header: 'Country', cell: (info) => info.getValue() },
    { id: 'state', header: 'State', accessorFn: (row) => (row.state ? row.state.toString() : '-'), cell: (info) => info.getValue() },
    { accessorKey: 'city', header: 'City', cell: (info) => info.getValue() },
    { accessorKey: 'address', header: 'Address', cell: (info) => info.getValue(), enableSorting: false },
    { accessorKey: 'total', header: 'Total', cell: (info) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
    { header: 'Ações', cell: (info) => renderComponent(TableActions, { id: parseInt(info.row.getValue('id')) }), meta: { noExport: true }, enableSorting: false }
  ]
</script>

<div class="p-3">
  <div class="mb-6 text-center">
    <h1 class="h1">Pessoas</h1>
  </div>
  <div class="grid gap-2">
    <Table {rows} {columns} />
  </div>
</div>
