<script>
  import CardInventario from './CardInventario.svelte'
  import { page } from '$app/stores'
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import IconButton from '$lib/components/IconButton.svelte'
  import ShowChip from '$lib/components/ShowChip.svelte'
  import { EE_AUDITORIA, EE_AVALIACAO, EE_DISPONIVEL, EE_MANUTENCAO, EE_USOINTERNO, mapCondicao, mapEstadoEstoque, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import { DataHandler } from '@vincjo/datatables'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  export let data

  const est = data.estoques || []
  const inventarioDividido = contarEstados(est)
  const handler = new DataHandler(est, { rowsPerPage: 10 })
  const rows = handler.getRows()
  handler.sortDesc('preco_unitario')

  function contarEstados(estoques) {
    if (!Array.isArray(estoques)) return null
    const dados = {}
    Array.from(mapEstadoEstoque).forEach(([id]) => (dados[id] = { qntd: 0, custo: 0, preco: 0 }))
    for (let i = 0; i < estoques.length; i++) {
      const e = estoques[i]
      const tmp = dados[e.estado]
      tmp.qntd += e.qntd || 0
      tmp.custo += (e.qntd || 0) * e.custo || 0
      tmp.preco += (e.qntd || 0) * e.preco_unitario || 0
    }
    return dados
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Inventário</h1>
  </div>

  <div class="grid grid-cols-5 gap-2">
    <CardInventario color="green" value={inventarioDividido?.[EE_DISPONIVEL]} title={mapEstadoEstoque.get(EE_DISPONIVEL)} icon="fa6-solid:check-double" />
    <CardInventario color="purple" value={inventarioDividido?.[EE_AVALIACAO]} title={mapEstadoEstoque.get(EE_AVALIACAO)} icon="mdi:tag-arrow-up" />
    <CardInventario color="orange" value={inventarioDividido?.[EE_AUDITORIA]} title={mapEstadoEstoque.get(EE_AUDITORIA)} icon="fluent-mdl2:compliance-audit" />
    <CardInventario color="blue" value={inventarioDividido?.[EE_MANUTENCAO]} title={mapEstadoEstoque.get(EE_MANUTENCAO)} icon="mdi:wrench-clock" />
    <CardInventario color="gray" value={inventarioDividido?.[EE_USOINTERNO]} title={mapEstadoEstoque.get(EE_USOINTERNO)} icon="mdi:account-lock" />
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy="data_entrada">Data Entrada</TH>
          <TH orderBy={(row) => mapFluxoEstoque.get(row.forma_entrada)}>Forma Entrada</TH>
          <TH orderBy="qntd">Qntd</TH>
          <TH orderBy="p_nome">Produto</TH>
          <TH orderBy="codigo">Código</TH>
          <TH orderBy={(row) => mapCondicao.get(row.condicao)}>Condição</TH>
          <TH orderBy={(row) => mapOrigem.get(row.origem)}>Origem</TH>
          <TH orderBy={(row) => mapEstadoEstoque.get(row.estado)}>Status</TH>
          <TH orderBy={(row) => row.custo / row.qntd}>Custo Unit.</TH>
          <TH orderBy="preco_unitario">Preço Unit.</TH>
          <th rowspan="2">Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => new Date(row.data_entrada).toLocaleString()} />
          <THF filterBy={(row) => mapFluxoEstoque.get(row.forma_entrada)} />
          <THF filterBy="qntd" />
          <THF filterBy="p_nome" />
          <THF filterBy="codigo" />
          <THF filterBy={(row) => mapCondicao.get(row.condicao)} />
          <THF filterBy={(row) => mapOrigem.get(row.origem)} />
          <THF filterBy={(row) => mapEstadoEstoque.get(row.estado)}>Status</THF>
          <THF filterBy={(row) => row.custo / row.qntd}>Custo Unit.</THF>
          <THF filterBy="preco_unitario" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td class="!whitespace-nowrap">{new Date(row.data_entrada).toLocaleString()}</td>
            <td><ShowChip text={mapFluxoEstoque.get(row.forma_entrada)} value={row.forma_entrada} /></td>
            <td>{row.qntd}</td>
            <td class="!whitespace-nowrap">{row.p_nome}</td>
            <td>{row.codigo ?? ''}</td>
            <td><ShowChip text={mapCondicao.get(row.condicao)} value={row.condicao} /></td>
            <td><ShowChip text={mapOrigem.get(row.origem)} value={row.origem} /></td>
            <td><ShowChip text={mapEstadoEstoque.get(row.estado)} value={row.estado} /></td>
            <td>{formatMoeda(row.custo / row.qntd)}</td>
            <td>{formatMoeda(row.preco_unitario)}</td>
            <td class="flex flex-nowrap justify-center">
              {#if $page.data.sessao?.gpe?.pode_iniciar_venda}
                <IconButton
                  disabled={row.estado !== EE_DISPONIVEL ? true : undefined}
                  href={`/loja/vender?eid=${row.id}`}
                  icon="mdi:point-of-sale"
                  width="20px"
                  height="20px"
                  data-tooltip="Iniciar Venda"
                  data-placement="left"
                />
              {/if}
              {#if $page.data.sessao?.gpe?.pode_entrada_estoque}
                <IconButton href={`/estoque/inventario/${row.id}`} icon="fa6-solid:eye" width="20px" height="20px" data-tooltip="Ver Detalhes" data-placement="left" />
              {/if}
              {#if $page.data.sessao?.gpe?.pode_entrada_estoque}
                <IconButton href={`/estoque/entradas/${row.entrada_id}`} icon="ri:inbox-archive-fill" width="20px" height="20px" data-tooltip="Abrir Entrada" data-placement="left" />
              {/if}
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
