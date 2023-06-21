<script>
  export let options, globalFilter
  let timer

  function setGlobalFilter(filter) {
    globalFilter = filter
    options.update((old) => ({ ...old, state: { ...old.state, globalFilter: filter } }))
  }
  function handleSearch(e) {
    clearTimeout(timer)
    timer = setTimeout(() => setGlobalFilter(e.target.value), 150)
  }
</script>

<input type="search" class="input variant-ghost w-96" on:keyup={handleSearch} on:search={handleSearch} placeholder="Buscar..." />
