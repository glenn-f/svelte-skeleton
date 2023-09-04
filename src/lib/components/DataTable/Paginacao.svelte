<script>
  import Icon from '@iconify/svelte'
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  const pageNumber = handler.getPageNumber()
  const pageCount = handler.getPageCount()
  const pages = handler.getPages({ ellipsis: true })
</script>

<div class={`btn-group variant-filled select-none ${$$props.class || ''}`}>
  <button
    class="hover:!bg-primary-400"
    type="button"
    disabled={$pageNumber === 1}
    class:pointer-events-none={$pageNumber === 1}
    class:disabled={$pageNumber === 1}
    on:click={() => handler.setPage('previous')}
  >
    <Icon icon="fa6-solid:arrow-left" />
  </button>
  {#each $pages as page}
    <button
      type="button"
      class="w-0 hover:!bg-primary-400"
      class:variant-filled-primary={$pageNumber === page}
      class:pointer-events-none={$pageNumber === page || page === null}
      on:click={() => handler.setPage(page)}
    >
      {page ?? '...'}
    </button>
  {/each}
  <button
    class="hover:!bg-primary-400"
    type="button"
    disabled={$pageNumber === $pageCount}
    class:pointer-events-none={$pageNumber === $pageCount}
    class:disabled={$pageNumber === $pageCount}
    on:click={() => handler.setPage('next')}
  >
    <Icon icon="fa6-solid:arrow-right" />
  </button>
</div>
