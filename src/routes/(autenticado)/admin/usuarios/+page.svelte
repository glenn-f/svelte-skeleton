<script>
  import { Table } from '$lib/components/Table'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import { USUARIO_ADMINISTRADOR } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let data

  let columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'delecao', header: 'Desativação', cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '') },
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'tipo_usuario', header: 'Tipo de Usuário', cell: (info) => data.permOptions.get(info.getValue()) },
    { accessorKey: 'criador', header: 'Criador' },
    {
      header: 'Status',
      cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao, disabled: info.row.original.tipo_usuario === USUARIO_ADMINISTRADOR }),
      enableSorting: false
    },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original, permOptions: data.permOptions }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  $: propsAdicionar = { modo: 'adicionar', formData: data.formAdicionar, permOptions: data.permOptions }

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormUsuario,
        props: propsAdicionar
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
