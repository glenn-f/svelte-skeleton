<script>
  import CheckMark from '$lib/components/CheckMark.svelte'
  import { Table } from '$lib/components/Table'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormGrupos from './ModalFormGrupos.svelte'
  export let data

  $: rows = data.rows || []
  let columns = [
    { accessorKey: 'nome', header: 'Nome do Grupo' },
    { accessorKey: 'menu_loja', header: 'Permissão Loja', cell: (info) => renderComponent(CheckMark, { percent: info.getValue(), showPercentLabel: true }), enableSorting: false },
    { accessorKey: 'menu_estoque', header: 'Permissão Estoque', cell: (info) => renderComponent(CheckMark, { percent: info.getValue(), showPercentLabel: true }), enableSorting: false },
    { accessorKey: 'menu_transacoes', header: 'Permissão Transações', cell: (info) => renderComponent(CheckMark, { percent: info.getValue(), showPercentLabel: true }), enableSorting: false },
    { accessorKey: 'menu_cadastros', header: 'Permissão Cadastros', cell: (info) => renderComponent(CheckMark, { percent: info.getValue(), showPercentLabel: true }), enableSorting: false },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: (info.row.original?.id), checked: (!info.row.original?.delecao) }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.form, initialData: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormGrupos,
        props: { modo: 'adicionar', formData: data.formAdicionar }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Grupos de Usuários</h1>
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
