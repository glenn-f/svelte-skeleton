<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import { formatTaxa } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormTributo from './ModalFormTributo.svelte'
  export let data

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.contas || [])
  const rows = handler.getRows()

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormTributo, props: { modo: 'adicionar', formData: data.formAdicionar } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormTributo, props: { modo: 'editar', initialData: { ...row }, formData: data.formEditar } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid place-items-center">
  <div class="container">
    <div class="grid gap-3 bg-surface-100-800-token p-2 rounded-md">
      <div class="flex items-center">
        <h1 class="h1 text-center mr-3">Regras de Tributação</h1>
        <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
          <Icon icon="fa6-solid:plus" />
          <span>Adicionar</span>
        </button>
      </div>

      <DataTable {handler}>
        <table class="table table-compact table-hover text-center">
          <thead class="!bg-surface-300-600-token whitespace-nowrap">
            <tr class="!text-center">
              <TH orderBy="nome">Nome do Tributo</TH>
              <TH orderBy="descricao">Descrição</TH>
              <TH orderBy={(row) => formatTaxa(row.taxa_fixa) + '%'}>Taxa</TH>
              <TH orderBy={(row) => !row.delecao}>Status</TH>
              <th>Ações</th>
            </tr>
            <tr>
              <THF filterBy="nome" />
              <THF filterBy="descricao" />
              <THF filterBy={(row) => formatTaxa(row.taxa_fixa) + '%'} />
              <td class="w-0" />
              <td class="w-0" />
            </tr>
          </thead>
          <tbody>
            {#each $rows as row}
              <tr>
                <td>{row.nome ?? ''}</td>
                <td>{row.descricao ?? ''}</td>
                <td>{formatTaxa(row.taxa_fixa) + '%'}</td>
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
  </div>
</div>
