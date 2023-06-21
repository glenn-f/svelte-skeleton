<script>
  import Icon from '@iconify/svelte'
  export let tableOptions, table

  function setCurrentPage(page) {
    tableOptions.update((old) => {
      return { ...old, state: { ...old.state, pagination: { ...old.state?.pagination, pageIndex: page } } }
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
</div>
