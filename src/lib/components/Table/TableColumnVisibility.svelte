<script>
  import { writable } from 'svelte/store'
  import { createSvelteTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/svelte-table'

  const columns = [
    {
      accessorKey: 'firstName',
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (info) => info.column.id
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
      footer: (info) => info.column.id
    },
    {
      accessorKey: 'visits',
      header: () => 'Visits',
      footer: (info) => info.column.id
    },
    {
      accessorKey: 'status',
      header: 'Status',
      footer: (info) => info.column.id
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      footer: (info) => info.column.id
    }
  ]

  const data = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    },
  ]

  let pagination = {
    pageIndex: 0,
    pageSize: 1,
  }
  let sorting = []
  let columnVisibility = {}

  const setSorting = (updater) => {
    if (updater instanceof Function) {
      sorting = updater(sorting)
    } else {
      sorting = updater
    }
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        sorting
      }
    }))
  }

  const setColumnVisibility = (updater) => {
    if (updater instanceof Function) {
      columnVisibility = updater(columnVisibility)
    } else {
      columnVisibility = updater
    }
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        columnVisibility
      }
    }))
  }
  
  const setPagination = (updater) => {
    if (updater instanceof Function) {
      pagination = updater(pagination)
    } else {
      pagination = updater
    }
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        pagination
      }
    }))
  }

  const options = writable({
    data,
    columns,
    state: {
      columnVisibility,
      sorting,
      pagination
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  })

  const rerender = () => {
    options.update((options) => ({
      ...options,
      data
    }))
  }

  const table = createSvelteTable(options)
</script>

<div class="inline-block border border-black shadow rounded">
  <div class="px-1 border-b border-black">
    <label>
      <input
        checked={$table.getIsAllColumnsVisible()}
        on:change={(e) => {
          console.info($table.getToggleAllColumnsVisibilityHandler()(e))
        }}
        type="checkbox"
      />{' '}
      Toggle All
    </label>
  </div>
  {#each $table.getAllLeafColumns() as column}
    <div class="px-1">
      <label>
        <input checked={column.getIsVisible()} on:change={column.getToggleVisibilityHandler()} type="checkbox" />{' '}
        {column.id}
      </label>
    </div>
  {/each}
</div>
<div class="p-2 table-container">
  <table class="table">
    <thead>
      {#each $table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <div class:table-sort-asc={header.column.getIsSorted().toString() == "asc"}   class:table-sort-dsc={header.column.getIsSorted().toString() == "desc"}  class:cursor-pointer={header.column.getCanSort()} class:select-none={header.column.getCanSort()} on:click={header.column.getToggleSortingHandler()}>
                  <svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
                </div>
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each $table.getRowModel().rows.slice(0, 10) as row}
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
  <div class="flex items-center gap-2">
    <button class="border rounded p-1" on:click={() => $table.setPageIndex(0)} disabled={!$table.getCanPreviousPage()}>
      {'<<'}
    </button>
    <button class="border rounded p-1" on:click={() => $table.previousPage()} disabled={!$table.getCanPreviousPage()}>
      {'<'}
    </button>
    <button class="border rounded p-1" on:click={() => $table.nextPage()} disabled={!$table.getCanNextPage()}>
      {'>'}
    </button>
    <button class="border rounded p-1" on:click={() => $table.setPageIndex($table.getPageCount() - 1)} disabled={!$table.getCanNextPage()}>
      {'>>'}
    </button>
</div>
    <div>{$table.getRowModel().rows.length} Rows</div>
    <pre>{JSON.stringify($table.getState().pagination, null, 2)}</pre>
</div>
