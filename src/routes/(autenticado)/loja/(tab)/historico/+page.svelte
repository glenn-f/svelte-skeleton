<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import IconButton from '$lib/components/IconButton.svelte'
  import ShowChip from '$lib/components/ShowChip.svelte'
  import { mapCondicao, mapOrigem } from '$lib/globals'
  import { diferencaEmHoras, formatMoeda } from '$lib/helpers'
  import { DataHandler } from '@vincjo/datatables'
  export let data

  const handler = new DataHandler(data.estoques || [], { rowsPerPage: 10 })
  const rows = handler.getRows()
  handler.sortDesc('data_venda')
</script>

<div class="grid gap-2">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3 mb-2">Histórico de Vendas</h1>
  </div>
  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy="data_venda">Data Venda</TH>
          <TH orderBy="vendedor">Vendedor</TH>
          <TH orderBy="produto">Produto</TH>
          <TH orderBy={(row) => mapCondicao.get(row.condicao)}>Condição</TH>
          <TH orderBy={(row) => mapOrigem.get(row.origem)}>Origem</TH>
          <TH orderBy="qntd_venda">Qntd</TH>
          <TH orderBy={(row) => row.preco_total / row.qntd_venda}>Preço Unit.</TH>
          <TH orderBy="preco_total">Preço Total</TH>
          <TH orderBy="codigo">Código</TH>
          <TH orderBy="observacoes">Observações</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => new Date(row.data_venda).toLocaleString()} />
          <THF filterBy="vendedor" />
          <THF filterBy="produto" />
          <THF filterBy={(row) => mapCondicao.get(row.condicao)} />
          <THF filterBy={(row) => mapOrigem.get(row.origem)} />
          <THF filterBy="qntd_venda" />
          <THF filterBy={(row) => row.preco_total / row.qntd_venda} />
          <THF filterBy="preco_total" />
          <THF filterBy="codigo" />
          <THF filterBy="observacoes" />
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each $rows as row, i}
          {@const diffHoras = diferencaEmHoras(row.data_venda)}
          <tr class:saida-12h={diffHoras < 12} class:saida-24h={diffHoras < 24} class:saida-36h={diffHoras < 36}>
            <td class="!whitespace-nowrap">{new Date(row.data_venda).toLocaleString()}</td>
            <td>{row.vendedor ?? ''}</td>
            <td class="!whitespace-nowrap">{row.produto}</td>
            <td><ShowChip text={mapCondicao.get(row.condicao)} value={row.condicao} /></td>
            <td><ShowChip text={mapOrigem.get(row.origem)} value={row.origem} /></td>
            <td>{row.qntd_venda}</td>
            <td>{formatMoeda(row.preco_total / row.qntd_venda)}</td>
            <td>{formatMoeda(row.preco_total)}</td>
            <td>{row.codigo ?? ''}</td>
            <td>{row.observacoes ?? ''}</td>
            <td class="flex flex-nowrap justify-center">
              <IconButton href={`/loja/historico/${row.pe_id}`} icon="mdi:receipt-text-check" width="20px" height="20px" data-tooltip="Ver Detalhes" data-placement="left" />
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
