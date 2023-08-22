<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormProduto from './ModalFormProduto.svelte'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import { renderComponent } from '@tanstack/svelte-table'
  import { formatMoeda, formatTaxa } from '$lib/helpers'

  export let data
  const pageSizes = [10, 25, 50]

  const getComissao = (id) => {
    const r = data.regrasComissao.find((v) => v.id == id)
    if (!r) return '-'
    const { nome, taxa_fixa, bonus_fixo } = r
    return `${nome}: ${formatTaxa(taxa_fixa)}% + R$${formatMoeda(bonus_fixo)}`
  }
  const getTributo = (id) => {
    const r = data.regrasTributo.find((v) => v.id == id)
    if (!r) return '-'
    const { nome, taxa_fixa } = r
    return `${nome}: ${formatTaxa(taxa_fixa)}%`
  }

  let columns = [
    // { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nome', header: 'Nome do Produto' },
    { accessorKey: 'produto_categoria_id', header: 'Categoria', cell: (info) => data.categorias.find((c) => c.id == info.getValue())?.nome },
    { accessorKey: 'titulo_codigo', header: 'Identificação Única' },
    { accessorKey: 'regra_tributo_id', header: 'Tributação', cell: ({ getValue: v }) => getTributo(v()) },
    { accessorKey: 'regra_comissao_id', header: 'Comissão', cell: ({ getValue: v }) => getComissao(v()) },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { initialData: info.row.original, data }), enableSorting: false }
  ]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormProduto,
        props: { modo: 'adicionar', formData: data.formAdicionar, data }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Produtos</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table rows={data.produtos} {columns} {pageSizes} />
    {/key}
  </div>
</div>
