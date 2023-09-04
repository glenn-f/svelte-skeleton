<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import IconButton from '$lib/components/IconButton.svelte'
  import ShowChip from '$lib/components/ShowChip.svelte'
  import { mapCondicao, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import { DataHandler } from '@vincjo/datatables'
  export let data

  const handler = new DataHandler(data.estoques || [], { rowsPerPage: 10 })
  const rows = handler.getRows()
  handler.sortDesc('preco_unitario')
</script>

<div class="grid gap-2">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3 mb-2">Estoque Disponível</h1>
  </div>
  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy={(row) => mapFluxoEstoque.get(row.forma_entrada)}>Forma Entrada</TH>
          <TH orderBy="qntd">Qntd</TH>
          <TH orderBy="produto">Produto</TH>
          <TH orderBy="preco_unitario">Preço Unit.</TH>
          <TH orderBy={(row) => mapCondicao.get(row.condicao)}>Condição</TH>
          <TH orderBy={(row) => mapOrigem.get(row.origem)}>Origem</TH>
          <TH orderBy="codigo">Código</TH>
          <TH orderBy="observacoes">Observações</TH>
          <th rowspan="2">Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => mapFluxoEstoque.get(row.forma_entrada)} />
          <THF filterBy="qntd" />
          <THF filterBy="produto" />
          <THF filterBy="preco_unitario" />
          <THF filterBy={(row) => mapCondicao.get(row.condicao)} />
          <THF filterBy={(row) => mapOrigem.get(row.origem)} />
          <THF filterBy="codigo" />
          <THF filterBy="observacoes" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td class="!whitespace-nowrap">{mapFluxoEstoque.get(row.forma_entrada)}</td>
            <td>{row.qntd}</td>
            <td class="!whitespace-nowrap">{row.produto}</td>
            <td>{formatMoeda(row.preco_unitario)}</td>
            <td><ShowChip text={mapCondicao.get(row.condicao)} value={row.condicao} /></td>
            <td><ShowChip text={mapOrigem.get(row.origem)} value={row.origem} /></td>
            <td>{row.codigo ?? ''}</td>
            <td>{row.observacoes ?? ''}</td>
            <td class="flex flex-nowrap justify-center">
              <IconButton href={`/loja/vender?eid=${row.id ?? ''}`} icon="mdi:point-of-sale" width="20px" height="20px" data-tooltip="Iniciar Venda" data-placement="left" />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </DataTable>
</div>
