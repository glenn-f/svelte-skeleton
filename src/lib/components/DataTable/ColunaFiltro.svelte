<script>
  import { getContext } from 'svelte'

  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler = getContext(`dt_handler`)
  /** @type {import("@vincjo/datatables").Field} */
  export let filterBy = null
  handler.on('clearFilters', () => (value = ''))
  let value = ''
</script>

<td class={$$props.class}>
  <input class="input !variant-glass" type="search" placeholder="Filtrar" bind:value on:input={() => handler.filter(value, filterBy)} />
</td>
