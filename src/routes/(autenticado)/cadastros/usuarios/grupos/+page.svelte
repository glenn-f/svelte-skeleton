<script>
  import CheckMark from '$lib/components/CheckMark.svelte'
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import Icon from '@iconify/svelte'
import { getModalStore } from '@skeletonlabs/skeleton'; const modalStore = getModalStore();
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormGrupos from './ModalFormGrupos.svelte'
  export let data

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.rows || [])
  const rows = handler.getRows()

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormGrupos, props: { modo: 'adicionar', formData: data.formAdicionar } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormGrupos, props: { modo: 'editar', initialData: { ...row }, formData: data.formEditar } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Grupos de Usuários</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy="nome">Nome do Grupo</TH>
          <TH orderBy="menu_loja">Permissão Loja</TH>
          <TH orderBy="menu_estoque">Permissão Estoque</TH>
          <TH orderBy="menu_transacoes">Permissão Transações</TH>
          <TH orderBy="menu_cadastros">Permissão Cadastros</TH>
          <TH orderBy={(row) => !row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy="nome" />
          <THF filterBy="menu_loja" />
          <THF filterBy="menu_estoque" />
          <THF filterBy="menu_transacoes" />
          <THF filterBy="menu_cadastros" />
          <td />
          <td />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{row.nome ?? ''}</td>
            <td><CheckMark percent={row.menu_loja} showPercentLabel={true} /></td>
            <td><CheckMark percent={row.menu_estoque} showPercentLabel={true} /></td>
            <td><CheckMark percent={row.menu_transacoes} showPercentLabel={true} /></td>
            <td><CheckMark percent={row.menu_cadastros} showPercentLabel={true} /></td>
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
