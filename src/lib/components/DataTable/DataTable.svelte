<script>
  import { setContext } from 'svelte'
  import BuscarGlobal from './BuscarGlobal.svelte'
  import LinhasAtuais from './LinhasAtuais.svelte'
  import LinhasPorPagina from './LinhasPorPagina.svelte'
  import Paginacao from './Paginacao.svelte'
  /** @type {import("@vincjo/datatables").DataHandler} */
  export let handler
  setContext(`dt_handler`, handler)
</script>

<div class="flex justify-between gap-2 items-center">
  <BuscarGlobal {handler} class="w-80" />
  <Paginacao {handler} />
</div>
<div class="table-container border border-surface-500">
  <slot />
</div>
<div class="flex justify-between gap-2 items-center">
  <LinhasAtuais {handler} />
  <LinhasPorPagina {handler} />
</div>
