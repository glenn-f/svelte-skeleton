<script>
  export let tableOptions,
    table,
    pageSizes = [10, 25, 50]

  function setPageSize(e) {
    const target = e.target
    tableOptions.update((old) => {
      return { ...old, state: { ...old.state, pagination: { ...old.state?.pagination, pageSize: parseInt(target.value) } } }
    })
  }
</script>

<div class="flex items-center">
  <!-- <label for="pageSize" class="label mr-2 whitespace-nowrap"> Registros por página:</label> -->
  <select id="pageSize" class="select w-16" value={$table.getState().pagination.pageSize} on:change={setPageSize}>
    {#each pageSizes as pageSize}
      <option value={pageSize}>
        {pageSize}
      </option>
    {/each}
  </select><br />
</div>
