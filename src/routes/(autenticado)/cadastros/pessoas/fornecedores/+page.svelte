<script>
  import { Table } from '$lib/components/Table'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import { PESSOA_FISICA, mapTipoPessoa } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from '../CelulaAcoes.svelte'
  import ModalFormPessoa from '../ModalFormPessoa.svelte'
  import { formatCNPJ, formatCPF } from '$lib/helpers'
  export let data

  $: rows = data.pessoas || []
  let columns = [
    // { accessorKey: 'id', header: 'ID' },
    // { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue()).toLocaleString() },
    // { accessorKey: 'desativacao', header: 'Desativação', cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '') },
    { accessorKey: 'tipo_pessoa', header: 'Tipo Pessoa', cell: (info) => mapTipoPessoa.get(info.getValue()) },
    { accessorKey: 'nome', header: 'Nome Completo/Nome Fantasia' },
    { header: 'CPF/CNPJ', cell: (info) => (info.row.original.tipo_pessoa == PESSOA_FISICA ? formatCPF(info.row.original.cpf) : formatCNPJ(info.row.original.cnpj)) },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormPessoa,
        props: { modo: 'fornecedor', formData: data.form, permOptions: data.permOptions }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Fornecedores</h1>
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
