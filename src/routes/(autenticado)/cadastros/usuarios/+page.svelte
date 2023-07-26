<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  export let data

  const GPEs = new Map(data.gpes.map((v, i) => [v.id, v]))
  let columns = [
    { accessorKey: 'criacao', header: 'Associação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'nome', header: 'Nome Completo' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'gpe_id', header: 'Grupo', cell: (info) => GPEs.get(info.getValue())?.nome },
    { accessorKey: 'criador_nome', header: 'Criador' },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original, permOptions: data.gpes }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormUsuario,
        props: { modo: 'adicionar', formData: data.formAdicionar, permOptions: data.gpes }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Usuários</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>
  <div class="grid gap-2">
    {#key data}
      <Table rows={data.usuarios} {columns} {pageSizes} />
    {/key}
  </div>
</div>
