<script>
  import exportExcel from '$lib/excelExport'
  import Icon from '@iconify/svelte'
  import { rankItem } from '@tanstack/match-sorter-utils'
  import {
    createSvelteTable,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    renderComponent
  } from '@tanstack/svelte-table'
  import { writable } from 'svelte/store'
  import FacetCheckboxes from '../../../lib/components/FacetCheckboxes.svelte'
  import FacetMinMax from '../../../lib/components/FacetMinMax.svelte'
  import EditRowBtn from './editRowBtn.svelte'
  import EditRowInputs from './editRowInputs.svelte'
  import InvEmailBtn from './TableActions.svelte'
  import { rowChanges } from './stores'

  let data = [
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

  const defaultColumns = [
    {      accessorKey: 'id',      header: 'ID',      cell: (info) => info.getValue().toString()    },
    {      accessorKey: 'date',      header: 'Date',      cell: (info) => new Date(info.getValue()).toLocaleString(),    },
    {      accessorKey: 'country',      header: 'Country',      cell: (info) => info.getValue(),    },
    {      id: 'state',      header: 'State',      accessorFn: (row) => (row.state ? row.state.toString() : '-'),      cell: (info) => info.getValue(),    },
    {      accessorKey: 'city',      header: 'City',      cell: (info) => info.getValue(),    },    
    {      accessorKey: 'address',      header: 'Address',      cell: (info) => info.getValue(),      enableSorting: false,    },
    {      accessorKey: 'total',      header: 'Total',      cell: (info) =>numFormat.format(info.getValue())    },
    {      header: 'Ações',      cell: (info) => renderComponent(InvEmailBtn, { id: parseInt(info.row.getValue('id')) }),      meta: { noExport: true },      enableSorting: false,    },
  ]

  const numFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const globalFilterFn = (row, columnId, value, addMeta) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return true
      return value.includes(row.getValue(columnId))
    }
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({itemRank})
    return itemRank.passed
  }
  
  let globalFilter = ''
  
  let pageSizes = [10,25,50]

  const options = writable({
    data: data,
    columns: defaultColumns,
    state: {
      globalFilter,
      pagination: {        pageSize: pageSizes[0],        pageIndex: 0      }
    },
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const table = createSvelteTable(options)

  function setGlobalFilter(filter) {
    globalFilter = filter
    options.update((old) => {      return {        ...old,        state: {          ...old.state,          globalFilter: filter        }      }    })
  }

  function setCurrentPage(page) {
    options.update((old) => {      return {        ...old,        state: {          ...old.state,          pagination: {            ...old.state?.pagination,            pageIndex: page          }        }      }    })
  }

  function setPageSize(e) {
    const target = e.target
    options.update((old) => {      return {        ...old,        state: {          ...old.state,          pagination: {            ...old.state?.pagination,            pageSize: parseInt(target.value)          }        }      }    })  
  }
  
  let timer

  function handleSearch(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const target = e.target
      setGlobalFilter(target.value)
    }, 300)
  }

  $: headerGroups = $table.getHeaderGroups()

</script>

<div class="col-span-2">
      <h2 class="h2 mb-3">Filtros</h2>

      {#each headerGroups as headerGroup}
        {#each headerGroup.headers as header}
          {#if header.column.id === 'country'}
            <details open>
              <summary> <h3 class="has-text-weight-semibold inline-block">Countries</h3></summary>

              <FacetCheckboxes table={$table} column={header.column} />
            </details>
          {:else if header.column.id === 'state'}
            <details open>
              <summary> <h3 class="has-text-weight-semibold inline-block">State</h3></summary>

              <FacetCheckboxes table={$table} column={header.column} />
            </details>
          {:else if header.column.id === 'total'}
            <details open>
              <summary> <h3 class="has-text-weight-semibold inline-block">Total</h3></summary>

              <FacetMinMax table={$table} column={header.column} />
            </details>
          {/if}
        {/each}
      {/each}
    </div>

