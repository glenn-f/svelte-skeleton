<script lang="ts">
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  /** @type {number[]} Opções de linhas por página.
   *
   * `Padrão = [5, 10, 20, 50, 100]`*/
  export let options = [5, 10, 20, 50, 100]
  /** @type {string} Classes adicionais ao elemento `select`*/
  export let inputClass = ''
  const rowsPerPage = handler.getRowsPerPage()
</script>

<aside class={$$props.class || ''}>
  Mostrar
  <select class={`input ${inputClass}`} bind:value={$rowsPerPage}>
    {#each options as option}
      <option value={option}>
        {option}
      </option>
    {/each}
  </select>
  linhas
</aside>

<style>
  aside {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }
</style>
