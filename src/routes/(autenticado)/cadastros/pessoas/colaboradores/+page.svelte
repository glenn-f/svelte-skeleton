<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import { PESSOA_FISICA, mapTipoPessoa } from '$lib/globals'
  import { formatCNPJ, formatCPF } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormPessoa from '../ModalFormPessoa.svelte'
  export let data

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.pessoas || [])
  const rows = handler.getRows()

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormPessoa, props: { modo: 'colaborador', formData: data.formAdicionar } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormPessoa, props: { modo: 'editar', initialData: { ...row }, formData: data.formEditar } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Colaboradores</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy={(row) => mapTipoPessoa.get(row.tipo_pessoa)}>Tipo Pessoa</TH>
          <TH orderBy="nome">Nome Completo/Nome Fantasia</TH>
          <TH orderBy={(row) => (row.tipo_pessoa == PESSOA_FISICA ? formatCPF(row.cpf) : formatCNPJ(row.cnpj))}>CPF/CNPJ</TH>
          <TH orderBy={(row) => !row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => mapTipoPessoa.get(row.tipo_pessoa)} />
          <THF filterBy="nome" />
          <THF filterBy={(row) => (row.tipo_pessoa == PESSOA_FISICA ? formatCPF(row.cpf) : formatCNPJ(row.cnpj))} />
          <td class="w-0" />
          <td class="w-0" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{mapTipoPessoa.get(row.tipo_pessoa) ?? ''}</td>
            <td>{row.nome ?? ''}</td>
            <td>{row.tipo_pessoa == PESSOA_FISICA ? formatCPF(row.cpf) : formatCNPJ(row.cnpj) ?? ''}</td>
            <td><RowStatusToggle id={row.id} checked={!row.delecao} /></td>
            <td class="flex flex-nowrap justify-center gap-1">
              <IconButton on:click={() => handleEditar(row)} icon="fa6-solid:pen-to-square" data-tooltip="Editar" data-placement="left" />
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="100">
              Nenhum registro encontrado
              <BtnLimparFiltro />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </DataTable>
</div>
