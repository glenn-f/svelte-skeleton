<script>
  import { getContext } from 'svelte'
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler = getContext(`dt_handler`)
  const filterCount = handler.getFilterCount()
</script>

<button disabled={$filterCount === 0} class:pointer-events-none={$filterCount === 0} class="btn btn-sm variant-filled-secondary select-none" on:click={() => handler.clearFilters()}>Limpar Filtros</button>
