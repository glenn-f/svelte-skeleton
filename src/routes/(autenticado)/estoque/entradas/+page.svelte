<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import { mapProcessoEstoque } from '$lib/globals'
  import { diferencaEmHoras } from '$lib/helpers.js'
  import Icon from '@iconify/svelte'
  import { DataHandler } from '@vincjo/datatables'
  export let data

  const handler = new DataHandler(data.entradas || [], { rowsPerPage: 10 })
  const rows = handler.getRows()
  handler.sortDesc('criacao')
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Entradas</h1>
    <a class="btn variant-filled-primary h-min" href="/estoque/entradas/adicionar">
      <Icon icon="fa6-solid:arrow-up-right-from-square" />
      <span>Adicionar</span>
    </a>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH class="w-0" orderBy="criacao">Data Entrada</TH>
          <TH class="w-0" orderBy={(row) => mapProcessoEstoque.get(row.tipo_pe)}>Processo de Estoque</TH>
          <TH orderBy="responsavel">Responsável</TH>
          <TH orderBy="participante">Fornecedor</TH>
          <th rowspan="2">Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => new Date(row.criacao).toLocaleString()} />
          <THF filterBy={(row) => mapProcessoEstoque.get(row.tipo_pe)} />
          <THF filterBy="responsavel" />
          <THF filterBy="participante" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          {@const diffHoras = diferencaEmHoras(row.criacao)}
          <tr class:saida-12h={diffHoras < 12} class:saida-24h={diffHoras < 24} class:saida-36h={diffHoras < 36}>
            <td class="!whitespace-nowrap">{new Date(row.criacao).toLocaleString()}</td>
            <td>{mapProcessoEstoque.get(row.tipo_pe)}</td>
            <td class="!whitespace-nowrap">{row.responsavel ?? ''}</td>
            <td class="!whitespace-nowrap">{row.participante ?? ''}</td>
            <td class="flex flex-nowrap justify-center">
              <IconButton href={`/estoque/entradas/${row.id}`} icon="fa6-solid:eye" data-tooltip="Ver Detalhes" data-placement="left" />
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="100">
              Nenhum registro encontrado
              <BtnLimparFiltro />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </DataTable>
</div>

<style>
  .saida-36h {
    background-color: rgba(235, 226, 103, 0.4) !important;
  }
  .saida-24h {
    background-color: rgba(105, 247, 226, 0.4) !important;
  }
  .saida-12h {
    background-color: rgba(23, 253, 115, 0.5) !important;
  }
</style>
