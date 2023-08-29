<script>
  import CardInventario from './CardInventario.svelte'

  import { Table } from '$lib/components/Table'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import { EE_AUDITORIA, EE_AVALIACAO, EE_DISPONIVEL, EE_MANUTENCAO, EE_USOINTERNO, mapCondicao, mapEstadoEstoque, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import ShowChip from '$lib/components/ShowChip.svelte'
  import Icon from '@iconify/svelte'
  export let data

  $: rows = data.estoques || []
  let columns = [
    { accessorKey: 'data_entrada', header: 'Data Entrada', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'forma_entrada', header: 'Forma Entrada', cell: (info) => renderComponent(ShowChip, { text: mapFluxoEstoque.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'qntd', header: 'Qntd' },
    { accessorKey: 'p_nome', header: 'Produto' },
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'condicao', header: 'Condição', cell: (info) => renderComponent(ShowChip, { text: mapCondicao.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'origem', header: 'Origem', cell: (info) => renderComponent(ShowChip, { text: mapOrigem.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'estado', header: 'Status', cell: (info) => renderComponent(ShowChip, { text: mapEstadoEstoque.get(info.getValue()), value: info.getValue() }) },
    { accessorKey: 'custo', header: 'Custo Unit.', cell: (info) => formatMoeda(info.getValue() / info.row.original.qntd) },
    { accessorKey: 'preco_unitario', header: 'Preço Unit.', cell: (info) => formatMoeda(info.getValue()) },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { data: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]
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
  $: inventarioDividido = contarEstados(rows)
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
  <div class="grid gap-2">
    {#key data}
      <Table {rows} {columns} {pageSizes} />
    {/key}
  </div>
</div>
