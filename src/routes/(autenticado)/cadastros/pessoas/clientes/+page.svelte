<script>
    import { Table } from '$lib/components/Table'
    import Icon from '@iconify/svelte'
    // import { modalStore } from '@skeletonlabs/skeleton'
    export let data
    
    $: rows = data.rows || []
    let columns = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
      { accessorKey: 'desativacao', header: 'Desativação', cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '') },
      { accessorKey: 'nome', header: 'Nome' },
      { header: 'Status', cell: (info) => undefined/* renderComponent(CelulaStatus, { formData: data.form, initialData: info.row.original, permOptions: GPEs }) */, enableSorting: false },
      { header: 'Ações', cell: (info) => undefined/* renderComponent(CelulaAcoes, { formData: data.form, initialData: info.row.original, permOptions: GPEs }) */, enableSorting: false }
    ]
    const pageSizes = [10, 25, 50]
  
    function handleAdicionar() {
    //   modalStore.trigger({
    //     type: 'component',
    //     component: {
    //       ref: ModalFormUsuario,
    //       props: { modo: 'adicionar', formData: data.form, permOptions: data.permOptions }
    //     }
    //   })
    }
  </script>
  
  <div class="grid gap-3">
    <div class="flex items-center">
      <h1 class="h1 text-center mr-3">Clientes</h1>
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
  