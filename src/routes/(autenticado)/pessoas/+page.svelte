<script>
  import Icon from '@iconify/svelte'
  import {
    createSvelteTable,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    renderComponent
  } from '@tanstack/svelte-table'
  import { rankItem } from '@tanstack/match-sorter-utils'
  import { writable } from 'svelte/store'
  import exportExcel from '$lib/excelExport'
  import InvEmailBtn from './invEmailBtn.svelte'
  import EditRowBtn from './editRowBtn.svelte'
  import EditRowInputs from './editRowInputs.svelte'
  import { resetTableChanges, rowChanges } from './stores'
  import { invalidate } from '$app/navigation'
  import FacetCheckboxes from '../../../lib/components/FacetCheckboxes.svelte'
  import FacetMinMax from '../../../lib/components/FacetMinMax.svelte'
  import DevAccordion from '../../../lib/components/DevAccordion.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

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

  const numFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

  function getSortSymbol(isSorted) {
    return isSorted ? (isSorted === 'asc' ? '🔼' : '🔽') : ''
  }

  const globalFilterFn = (row, columnId, value, addMeta) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return true
      return value.includes(row.getValue(columnId))
    }

    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
      itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  const defaultColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => info.getValue().toString()
    },
    {
      accessorKey: 'date',
      id: 'Date',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
      header: 'Date'
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: (info) => info.getValue(),
      filterFn: globalFilterFn
    },
    {
      accessorFn: (row) => (row.state ? row.state.toString() : '-'),
      id: 'state',
      header: 'State',
      cell: (info) => info.getValue(),
      filterFn: globalFilterFn
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'address',
      header: 'Address',
      enableSorting: false,
      cell: (info) =>
        renderComponent(EditRowInputs, {
          id: parseInt(info.row.getValue('id')),
          colId: 'address',
          editT: 'text',
          initVal: info.getValue()
        })
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: (info) =>
        renderComponent(EditRowInputs, {
          id: parseInt(info.row.getValue('id')),
          colId: 'total',
          editT: 'number',
          initVal: numFormat.format(info.getValue())
        })
    },
    {
      header: 'Mail Receipt',
      cell: (info) => renderComponent(InvEmailBtn, { id: parseInt(info.row.getValue('id')) }),
      meta: {
        noExport: true
      }
    },
    {
      id: 'edit',
      header: 'Edit',
      cell: (info) => renderComponent(EditRowBtn, { row: info.row.original })
    }
  ]

  let globalFilter = ''

  const options = writable({
    data: data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageSize: 7,
        pageIndex: 0
      }
    },
    enableGlobalFilter: true
  })

  const table = createSvelteTable(options)

  function setGlobalFilter(filter) {
    globalFilter = filter
    options.update((old) => {
      return {
        ...old,
        state: {
          ...old.state,
          globalFilter: filter
        }
      }
    })
  }

  function setCurrentPage(page) {
    options.update((old) => {
      return {
        ...old,
        state: {
          ...old.state,
          pagination: {
            ...old.state?.pagination,
            pageIndex: page
          }
        }
      }
    })
  }

  function setPageSize(e) {
    const target = e.target
    options.update((old) => {
      return {
        ...old,
        state: {
          ...old.state,
          pagination: {
            ...old.state?.pagination,
            pageSize: parseInt(target.value)
          }
        }
      }
    })
  }

  let timer
  function handleSearch(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const target = e.target
      setGlobalFilter(target.value)
    }, 300)
  }

  function handleCurrPageInput(e) {
    const target = e.target
    setCurrentPage(parseInt(target.value) - 1)
  }

  const noTypeCheck = (x) => x

  $: headerGroups = $table.getHeaderGroups()

  function clickDownload() {
    exportExcel($table, 'invoices', true)
  }

  let rowsInEditCount = 0
  let currChanges = {}
  rowChanges.subscribe((val) => {
    currChanges = val
    rowsInEditCount = Object.keys(val).length
  })

  async function clickSave() {
    try {
      const res = await fetch('/api/invoices/saveChanges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currChanges)
      })
      const resData = await res.json()

      if (!resData.ok) {
        alert('Error saving changes' + resData.message)
        return
      }
    } catch (err) {
      alert('Error saving changes')
      return
    }

    resetTableChanges()
    await invalidate('invoice:load')
    options.update((old) => {
      return {
        ...old,
        data: data.invoices
      }
    })
  }
</script>

<div class="p-3">
  <div class="grid grid-cols-12 gap-2 mb-3">
    <div class="col-span-2" />
    <div class="col-span-10 flex justify-between">
      <h1 class="h1">Registros</h1>
      <div class="flex gap-1 align-items-center">
        <button class="btn variant-filled-tertiary" type="button" on:click={clickDownload}>
          <span><Icon icon="fa-solid:file-excel" /></span>
          <span>Excel</span>
        </button>
        <button class="btn variant-filled-primary" type="button" on:click={clickSave} disabled={rowsInEditCount === 0}>
          <span><Icon icon="fa-solid:save" /></span>
          <span>Salvar</span>
        </button>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-2">
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
    <div class="col-span-10 flex flex-col gap-1">
      <input {...noTypeCheck(null)} type="search" class="input" on:keyup={handleSearch} on:search={handleSearch} placeholder="Buscar..." />
      <div class="table-container">
        <table class="table table-compact">
          <thead>
            {#each headerGroups as headerGroup}
              <tr>
                {#each headerGroup.headers as header}
                  <th colspan={header.colSpan}>
                    {#if !header.isPlaceholder}
                      <div class="flex gap-1 items-center" class:cursor-pointer={header.column.getCanSort()} class:select-none={header.column.getCanSort()} on:click={header.column.getToggleSortingHandler()}>
                        <svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
                        {#if header.column.getIsSorted().toString() == 'asc'}
                          <Icon icon="mdi:arrow-up-thin" />
                        {:else if header.column.getIsSorted().toString() == 'desc'}
                          <Icon icon="mdi:arrow-down-thin" />
                        {:else if !header.column.getIsSorted() && header.column.getCanSort()}
                          <Icon icon="mdi:sort-alphabetical-variant" />
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
              <tr>
                {#each row.getVisibleCells() as cell}
                  <td>
                    <svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="flex align-items-center gap-1 justify-between">
        <div class="paginator-controls btn-group variant-filled">
          <button on:click={() => setCurrentPage($table.getState().pagination.pageIndex - 1)} class:disabled={!$table.getCanPreviousPage()} disabled={!$table.getCanPreviousPage()}>
            <Icon icon="fa6-solid:arrow-left" />
          </button>

          {#each { length: Math.ceil($table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize) } as _, i}
            <button
              class:variant-filled-primary={$table.getState().pagination.pageIndex == i}
              class:pointer-events-none={$table.getState().pagination.pageIndex == i}
              class:disabled={$table.getState().pagination.pageIndex == i}
              on:click={() => setCurrentPage(i)}
            >
              {i + 1}
            </button>
          {/each}
          <!-- <input class="input mx-1 w-20" type="number" value={$table.getState().pagination.pageIndex + 1} min={0} max={$table.getPageCount() - 1} on:change={handleCurrPageInput} /> -->
          <button on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)} class:disabled={!$table.getCanNextPage()} disabled={!$table.getCanNextPage()}>
            <Icon icon="fa6-solid:arrow-right" />
          </button>
        </div>
        <div class="flex items-center">
          <label for="pageSize" class="label mr-2 whitespace-nowrap"> Registros por página:</label>
          <select id="pageSize" class="select w-16" value={$table.getState().pagination.pageSize} on:change={setPageSize}>
            {#each [7, 10, 25, 50] as pageSize}
              <option value={pageSize}>
                {pageSize}
              </option>
            {/each}
          </select><br />
        </div>
      </div>
      <span>{$table.getPrePaginationRowModel().rows.length} registros</span>
    </div>
  </div>
</div>

<!-- <SuperDebug data={$table.getState()} /> -->
