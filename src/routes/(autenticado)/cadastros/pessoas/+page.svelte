<script>
  import { Table } from '$lib/components/Table'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormPessoa from './ModalFormPessoa.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import CelulaStatus from './CelulaStatus.svelte'
  import { mapRelacionamento, mapTipoPessoa, PESSOA_JURIDICA } from '$lib/globals'
  export let data
  const GPEs = new Map(data.permOptions.map((v, i) => [v.id, v]))
  let columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'criacao', header: 'Criação', cell: (info) => new Date(info.getValue())?.toLocaleString() },
    { accessorKey: 'nome', header: 'Nome' },
    {
      header: 'Documento',
      cell: (info) => {
        if (info.row.original.tipo_pessoa == PESSOA_JURIDICA) {
          return info.row.original.cnpj
        }
        return info.row.original.cpf
      }
    },
    { accessorKey: 'tipo_pessoa', header: 'Tipo Pessoa', cell: (info) => mapTipoPessoa.get(info.getValue()) },
    { accessorKey: 'tipo_relacionamento', header: 'Relação', cell: (info) => mapRelacionamento.get(info.getValue()) },
    { header: 'Status', cell: (info) => renderComponent(CelulaStatus, { formData: data.formEditar, initialData: info.row.original }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormPessoa,
        props: { modo: 'adicionar', formData: data.formAdicionar, permOptions: data.permOptions }
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
