<script>
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  let value = ''
</script>

<input class={`input ${$$props.class || ''}`} type="search" placeholder="Buscar..." bind:value on:input={() => handler.search(value)} />
