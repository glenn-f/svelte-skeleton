<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import { USUARIO_ADMINISTRADOR } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  import ShowChip from '$lib/components/ShowChip.svelte'
  export let data

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.usuarios || [])
  const rows = handler.getRows()

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'adicionar', formData: data.formAdicionar, permOptions: data.permOptions } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'editar', initialData: { ...row }, formData: data.formEditar } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Usuários</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH class="w-0" orderBy="id">ID</TH>
          <TH class="w-0" orderBy="criacao">Criação</TH>
          <TH class="w-0" orderBy="delecao">Desativação</TH>
          <TH orderBy="nome">Nome</TH>
          <TH orderBy="email">E-mail</TH>
          <TH orderBy="criador">Criador</TH>
          <TH class="w-0" orderBy={(row) => data.permOptions.get(row.tipo_usuario)}>Tipo de Usuário</TH>
          <TH orderBy={(row) => !!row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy="id" />
          <THF filterBy={(row) => new Date(row.criacao).toLocaleString()} />
          <THF filterBy={(row) => (row.delecao ? new Date(row.delecao).toLocaleString() : '')} />
          <THF filterBy="nome" />
          <THF filterBy="email" />
          <THF filterBy="criador" />
          <THF filterBy={(row) => data.permOptions.get(row.tipo_usuario)} />
          <td />
          <td />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{row.id}</td>
            <td class="!whitespace-nowrap">{new Date(row.criacao).toLocaleString()}</td>
            <td class="!whitespace-nowrap">{row.delecao ? new Date(row.delecao).toLocaleString() : ''}</td>
            <td>{row.nome ?? ''}</td>
            <td>{row.email ?? ''}</td>
            <td>{row.criador ?? ''}</td>
            <td><ShowChip text={data.permOptions.get(row.tipo_usuario)} value={row.tipo_usuario} /></td>
            <td><RowStatusToggle id={row.id} checked={!row.delecao} disabled={row.tipo_usuario === USUARIO_ADMINISTRADOR} /></td>
            <td class="flex flex-nowrap justify-center gap-1">
              <IconButton disabled icon="fa6-solid:arrow-up-right-from-square" data-tooltip="Abrir Detalhes" data-placement="left" />
              <IconButton on:click={() => handleEditar(row)} icon="fa6-solid:pen-to-square" disabled={row.tipo_usuario === USUARIO_ADMINISTRADOR} data-tooltip="Editar" data-placement="left" />
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
