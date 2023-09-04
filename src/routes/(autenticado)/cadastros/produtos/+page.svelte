<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  import Icon from '@iconify/svelte'
import { getModalStore } from '@skeletonlabs/skeleton'; const modalStore = getModalStore();
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormProduto from './ModalFormProduto.svelte'
  export let data
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

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.produtos || [])
  const rows = handler.getRows()
  $: categorias = data.categorias || []

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormProduto, props: { modo: 'adicionar', formData: data.formAdicionar, data } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormProduto, props: { modo: 'editar', formData: data.formEditar, data, initialData: { ...row } } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Produtos</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy="nome">Nome do Produto</TH>
          <TH orderBy={(row) => categorias.find((c) => c.id == row.produto_categoria_id)?.nome}>Categoria</TH>
          <TH orderBy="titulo_codigo">Identificação Única</TH>
          <TH orderBy={(row) => getTributo(row.regra_tributo_id)}>Tributação</TH>
          <TH orderBy={(row) => getComissao(row.regra_comissao_id)}>Comissão</TH>
          <TH orderBy={(row) => !row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy="nome" />
          <THF filterBy={(row) => categorias.find((c) => c.id == row.produto_categoria_id)?.nome} />
          <THF filterBy="titulo_codigo" />
          <THF filterBy={(row) => getTributo(row.regra_tributo_id)} />
          <THF filterBy={(row) => getComissao(row.regra_comissao_id)} />
          <td class="w-0" />
          <td class="w-0" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{row.nome ?? ''}</td>
            <td>{categorias.find((c) => c.id == row.produto_categoria_id)?.nome ?? ''}</td>
            <td>{row.titulo_codigo ?? ''}</td>
            <td>{getTributo(row.regra_tributo_id) ?? ''}</td>
            <td>{getComissao(row.regra_comissao_id) ?? ''}</td>
            <td><RowStatusToggle id={row.id} checked={!row.delecao} /></td>
            <td class="flex flex-nowrap justify-center gap-1">
              <IconButton on:click={() => handleEditar(row)} icon="fa6-solid:pen-to-square" data-tooltip="Editar" data-placement="left" />
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
