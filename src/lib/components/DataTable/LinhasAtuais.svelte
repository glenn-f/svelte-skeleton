<script>
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  const rowCount = handler.getRowCount()
</script>

<div class>
  {#if $rowCount.total > 0}
    <b>{$rowCount.start}</b>-<b>{$rowCount.end}</b>
    de <b>{$rowCount.total}</b>
    registros
  {:else}
    Nenhum registro encontrado
  {/if}
</div>
