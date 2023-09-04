<script>
  import Icon from '@iconify/svelte'
  import { getContext } from 'svelte'

  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler = getContext(`dt_handler`)
  /** @type {import("@vincjo/datatables").Field} */
  export let orderBy = null

  const identifier = orderBy?.toString()
  const sorted = handler.getSort()
  function sort() {
    if ($sorted.identifier !== identifier) handler.sortAsc(orderBy)
    else if ($sorted.direction === 'asc') handler.sortDesc(orderBy)
    else handler.clearSort()
  }
</script>

<th on:click={sort} class={`cursor-pointer select-none transition-all ${$$props.class ?? ''}`} class:hover:bg-secondary-hover-token={orderBy}>
  <slot />
  <span class="inline-block">
    {#if orderBy}
      {#if $sorted.identifier !== identifier}
        <Icon icon="fa6-solid:sort" />
      {:else if $sorted.direction === 'asc'}
        <Icon icon="fa6-solid:sort-up" class="text-primary-400-500-token" />
      {:else}
        <Icon icon="fa6-solid:sort-down" class="text-primary-400-500-token" />
      {/if}
    {/if}
  </span>
</th>
