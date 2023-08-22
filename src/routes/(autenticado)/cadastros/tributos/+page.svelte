<script>
  import { Table } from '$lib/components/Table'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormTributo from './ModalFormTributo.svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  export let data

  $: rows = data.contas || []
  let columns = [
    // { accessorKey: 'id', header: 'ID' },
    // { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    // { accessorKey: 'desativacao', header: 'Desativação', cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '') },
    { accessorKey: 'nome', header: 'Nome do Tributo' },
    { accessorKey: 'descricao', header: 'Descrição', cell: (info) => info.getValue() },
    { accessorKey: 'taxa_fixa', header: 'Taxa', cell: (info) => formatTaxa(info.getValue()) + '%' },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormTributo,
        props: { modo: 'adicionar', formData: data.form }
      }
    })
  }
</script>

<div class="grid place-items-center">
  <div class="container">
    <div class="grid gap-3 bg-surface-100-800-token p-2 rounded-md">
      <div class="flex items-center">
        <h1 class="h1 text-center mr-3">Regras de Tributação</h1>
        <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
          <Icon icon="fa6-solid:plus" />
          <span>Adicionar</span>
        </button>
      </div>
      <div class="grid gap-2">
        {#key data}
          <Table {rows} {columns} {pageSizes} />
        {/key}
      </div>
    </div>
  </div>
</div>
