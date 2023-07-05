<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormPessoa from './ModalFormPessoa.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import CelulaStatus from './CelulaStatus.svelte'
  export let data
  const GPEs = new Map(data.permOptions.map((v, i) => [v.id, v]))
  let columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue())?.toLocaleString() },
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'cpf', header: 'CPF' },
    { accessorKey: 'cnpj', header: 'CNPJ' },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: (info) => {
        let linha = info.row.original
        let res = ''
        if (linha.eh_colaborador) res += 'Colaborador'
        if (linha.eh_cliente) res += (res ? ' / ' : '') + 'Cliente'
        if (linha.eh_fornecedor) res += (res ? ' / ' : '') + 'Fornecedor'
        return res
      }
    },
    { header: 'Status', cell: (info) => renderComponent(CelulaStatus, { formData: data.form, initialData: info.row.original }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.form, initialData: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormPessoa,
        props: { modo: 'adicionar', formData: data.form, permOptions: data.permOptions }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Pessoas</h1>
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
