<script>
  import BuscarGlobal from './BuscarGlobal.svelte'
  import ColunaCabecalho from './ColunaCabecalho.svelte'
  import ColunaFiltro from './ColunaFiltro.svelte'
  import LinhasAtuais from './LinhasAtuais.svelte'
  import LinhasPorPagina from './LinhasPorPagina.svelte'
  import Paginacao from './Paginacao.svelte'
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  /** @type {import('.').DTSColsOptions}*/
  export let cols
  const rows = handler.getRows()
</script>

<div class="flex justify-between gap-2 items-center">
  <BuscarGlobal {handler} class="w-80" />
  <Paginacao {handler} />
</div>
<div class="table-container border border-surface-500">
  <table class="table table-compact table-hover">
    <thead>
      <tr>
        {#each cols as { orderBy: o, title, key }}
          {@const orderBy = o ?? key}
          <ColunaCabecalho {handler} {orderBy}>{title}</ColunaCabecalho>
        {/each}
      </tr>
      <tr>
        {#each cols as { filterBy: f, key }}
          {@const filterBy = f ?? key}
          <ColunaFiltro {handler} {filterBy} />
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each $rows as r}
        <tr>
          {#each cols as { key, cell }}
            {@const value = cell ? cell(r) : r[key]}
            <td>{@html value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="flex justify-between gap-2 items-center">
  <LinhasAtuais {handler} />
  <LinhasPorPagina {handler} />
</div>
