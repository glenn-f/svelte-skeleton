<script>
  import { fmtMoeda } from '$lib/globals.js'
  import Icon from '@iconify/svelte'
  import { rankItem } from '@tanstack/match-sorter-utils'
  import { createSvelteTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, renderComponent } from '@tanstack/svelte-table'
  import { writable } from 'svelte/store'
  import TableActions from './TableActions.svelte'
  import TablePageSize from './TablePageSize.svelte'
  import TablePaginator from './TablePaginator.svelte'
  import TableSearchInput from './TableSearchInput.svelte'

  export let rows = [
    { id: 1, date: '2022-01-01', country: 'Hungria', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 },
    { id: 1, date: '2022-01-01', country: 'Brasil', state: 'AM', city: 'Manaus', address: 'SEMSA', total: 50 }
  ]

  export let columns = [
    { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue().toString() },
    { accessorKey: 'date', header: 'Date', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'country', header: 'Country', cell: (info) => info.getValue() },
    { accessorKey: 'state', header: 'State', cell: (info) => info.getValue() },
    { accessorKey: 'city', header: 'City', cell: (info) => info.getValue() },
    { accessorKey: 'address', header: 'Address', cell: (info) => info.getValue(), enableSorting: false },
    { accessorKey: 'total', header: 'Total', cell: (info) => fmtMoeda.format(info.getValue()) },
    { header: 'Ações', cell: (info) => renderComponent(TableActions, { id: parseInt(info.row.getValue('id')) }), enableSorting: false }
  ]

  export let pageSizes = [10, 25, 50]

  const globalFilterFn = (row, columnId, value, addMeta) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return true
      return value.includes(row.getValue(columnId))
    }
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  let globalFilter = ''

  const options = writable({
    data: rows,
    columns: columns,
    state: {
      globalFilter,
      pagination: { pageSize: pageSizes[0], pageIndex: 0 }
    },
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    getPaginationRowModel: getPaginationRowModel()
  })

  const table = createSvelteTable(options)

  $: headerGroups = $table.getHeaderGroups()
</script>

<div class="flex gap-2 justify-between">
  <TableSearchInput {options} {globalFilter} />
  <div class="flex gap-2">
    <TablePaginator tableOptions={options} {table} />
    <TablePageSize tableOptions={options} {table} {pageSizes} />
  </div>
</div>
<table class="table table-compact">
  <thead>
    {#each headerGroups as headerGroup}
      <tr>
        {#each headerGroup.headers as header}
          <th class:hover:bg-secondary-hover-token={header.column.getCanSort()} colspan={header.colSpan}>
            {#if !header.isPlaceholder}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="flex gap-1 items-center" class:cursor-pointer={header.column.getCanSort()} class:select-none={header.column.getCanSort()} on:click={header.column.getToggleSortingHandler()}>
                <svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
                {#if header.column.getIsSorted().toString() == 'asc'}
                  <Icon icon="fa6-solid:sort-up" class="text-primary-400-500-token" />
                {:else if header.column.getIsSorted().toString() == 'desc'}
                  <Icon icon="fa6-solid:sort-down" class="text-primary-400-500-token" />
                {:else if !header.column.getIsSorted() && header.column.getCanSort()}
                  <Icon icon="fa6-solid:sort" />
                {/if}
              </div>
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each $table.getRowModel().rows as row}
      <tr class="hover:bg-primary-hover-token">
        {#each row.getVisibleCells() as cell}
          <td>
            <svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
  <tfoot class="text-center">
    <tr>
      <td colspan="100" class="text-center !p-1 bg-surface-300-600-token normal-case">
        Mostrando {$table.getRowModel().rows.length} de {rows?.length ?? 0} registros
      </td>
    </tr>
  </tfoot>
</table>
