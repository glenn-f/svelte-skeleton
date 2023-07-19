<script>
    import { Table } from '$lib/components/Table'
    import Icon from '@iconify/svelte'
    import { modalStore } from '@skeletonlabs/skeleton'
    import ModalFormCategoria from './ModalFormCategoria.svelte'
    
    export let data
    const pageSizes = [10, 25, 50]
    
    let columns = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'nome', header: 'Nome' },
      { header: 'Status', cell: (info) => "TODO", enableSorting: false },
      { header: 'Ações', cell: (info) => "TODO", enableSorting: false }
    ]
    
    function handleAdicionar() {
      modalStore.trigger({
        type: 'component',
        component: {
          ref: ModalFormCategoria,
          props: { modo: 'adicionar', formData: data.formAdicionar }
        }
      })
    }
  </script>
  
  <div class="grid gap-3">
    <div class="flex items-center">
      <h1 class="h1 text-center mr-3">Categorias</h1>
      <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
        <Icon icon="fa6-solid:plus" />
        <span>Adicionar</span>
      </button>
    </div>
    <div class="grid gap-2">
      {#key data}
        <Table rows={data.categorias} {columns} {pageSizes} />
      {/key}
    </div>
  </div>
  