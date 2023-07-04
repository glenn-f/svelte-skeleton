<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import CelulaStatus from './CelulaStatus.svelte'
  export let data
  const GPEs = new Map(data.permOptions.map((v, i) => [v.id, v]))
  let columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'associacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    { accessorKey: 'desativacao', header: 'Desativação', cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '') },
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'gpe_id', header: 'Permissão', cell: (info) => GPEs.get(info.getValue()).nome },
    { accessorKey: 'criador_nome', header: 'Criador' },
    { header: 'Status', cell: (info) => renderComponent(CelulaStatus, { formData: data.form, initialData: info.row.original, permOptions: GPEs }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.form, initialData: info.row.original, permOptions: GPEs }), enableSorting: false }
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
