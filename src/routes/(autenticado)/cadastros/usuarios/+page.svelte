<script>
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import { USUARIO_ADICIONAL } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let data

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(data.usuarios || [])
  const rows = handler.getRows()
  const GPEs = new Map(data.gpes.map((v, i) => [v.id, v]))

  function handleAdicionar() {
    modalStore.trigger({ type: 'component', component: { ref: ModalFormUsuario, props: { modo: 'adicionar', formData: data.formAdicionar, permOptions: data.gpes } } })
  }
  function handleEditar(row) {
    const { id, nome, email, gpe_id, tipo_usuario } = row
    const initial = { id, nome, email, gpe_id, tipo_usuario }
    modalStore.trigger({ type: 'component', component: { ref: ModalFormUsuario, props: { modo: 'editar', initialData: initial, permOptions: data.gpes, formData: data.formEditar } } })
  }
  function handleSenha(row) {
    const { id, nome, email, gpe_id, tipo_usuario } = row
    const initial = { id, nome, email, gpe_id, tipo_usuario }
    modalStore.trigger({ type: 'component', component: { ref: ModalFormUsuario, props: { modo: 'senha', initialData: initial, permOptions: data.gpes, formData: data.formEditar } } })
  }

  onMount(() => handler.sortDesc('criacao'))
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
          <TH class="w-0" orderBy="criacao">Associação</TH>
          <TH orderBy="nome">Nome Completo</TH>
          <TH orderBy="email">E-mail</TH>
          <TH orderBy={(row) => GPEs.get(row.gpe_id)?.nome}>Grupo</TH>
          <TH orderBy="criador_nome">Criador</TH>
          <TH orderBy={(row) => !!row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => new Date(row.criacao).toLocaleString()} />
          <THF filterBy="nome" />
          <THF filterBy="email" />
          <THF filterBy={(row) => GPEs.get(row.gpe_id)?.nome} />
          <THF filterBy="criador_nome" />
          <td />
          <td />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td class="!whitespace-nowrap">{new Date(row.criacao).toLocaleString()}</td>
            <td>{row.nome ?? ''}</td>
            <td>{row.email ?? ''}</td>
            <td>{GPEs.get(row.gpe_id)?.nome ?? ''}</td>
            <td>{row.criador_nome ?? ''}</td>
            <td><RowStatusToggle id={row.id} checked={!row.delecao} /></td>
            <td class="flex flex-nowrap justify-center gap-1">
              <IconButton on:click={() => handleEditar(row)} icon="fa6-solid:pen-to-square" data-tooltip="Editar" data-placement="left" />
              <IconButton disabled={row.tipo_usuario !== USUARIO_ADICIONAL} on:click={() => handleSenha(row)} icon="fa6-solid:lock" data-tooltip="Alterar Senha" data-placement="left" />
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
