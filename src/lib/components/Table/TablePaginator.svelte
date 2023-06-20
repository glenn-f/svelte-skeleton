<script>
  import Icon from '@iconify/svelte'

  export let tableOptions,
    table,
    pageSizes = [10, 25, 50]

  function setCurrentPage(page) {
    tableOptions.update((old) => {
      return { ...old, state: { ...old.state, pagination: { ...old.state?.pagination, pageIndex: page } } }
    })
  }

  function setPageSize(e) {
    const target = e.target
    tableOptions.update((old) => {
      return { ...old, state: { ...old.state, pagination: { ...old.state?.pagination, pageSize: parseInt(target.value) } } }
    })
  }
</script>

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
    <button on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)} class:disabled={!$table.getCanNextPage()} disabled={!$table.getCanNextPage()}>
      <Icon icon="fa6-solid:arrow-right" />
    </button>
  </div>
  <div class="flex items-center">
    <label for="pageSize" class="label mr-2 whitespace-nowrap"> Registros por página:</label>
    <select id="pageSize" class="select w-16" value={$table.getState().pagination.pageSize} on:change={setPageSize}>
      {#each pageSizes as pageSize}
        <option value={pageSize}>
          {pageSize}
        </option>
      {/each}
    </select><br />
  </div>
</div>
