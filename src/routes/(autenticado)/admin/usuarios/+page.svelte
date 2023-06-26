<script>
  import { Table, TableActions } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import FormAdicionarUsuario from './FormAdicionarUsuario.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data

  let columns = [
    { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue().toString() },
    { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'nome', header: 'Nome', cell: (info) => info.getValue() },
    { accessorKey: 'email', header: 'E-mail', cell: (info) => info.getValue() },
    { accessorKey: 'permUsuario', header: 'Permissão', cell: (info) => info.getValue() },
    { accessorKey: 'criador', header: 'Criador', cell: (info) => info.getValue(), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(TableActions, { id: parseInt(info.row.getValue('id')) }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function clickAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: FormAdicionarUsuario,
        props: { formData: data.form, permOptions: data.permOptions},
        slot: '<p>Skeleton</p>'
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Usuários</h1>
    <button class="btn variant-filled-tertiary h-min" on:click={clickAdicionar}>
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
