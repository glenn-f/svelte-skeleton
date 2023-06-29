<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data

  let columns = [
    { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue().toString() },
    { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'nome', header: 'Nome', cell: (info) => info.getValue() },
    { accessorKey: 'email', header: 'E-mail', cell: (info) => info.getValue() },
    { accessorKey: 'permUsuario', header: 'Permissão', cell: (info) => data.permOptions.get(info.getValue())?.label },
    { accessorKey: 'criador', header: 'Criador', cell: (info) => info.getValue() },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.form, initialData: info.row.original, permOptions: data.permOptions }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormUsuario,
        props: { modo: 'adicionar', formData: data.form, permOptions: data.permOptions }
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
