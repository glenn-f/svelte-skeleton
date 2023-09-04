<script>
  import CheckMark from '$lib/components/CheckMark.svelte'
  import { DataTable, TH, THF } from '$lib/components/DataTable'
  import BtnLimparFiltro from '$lib/components/DataTable/BtnLimparFiltro.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import RowStatusToggle from '$lib/components/RowStatusToggle.svelte'
  import { formatTaxa } from '$lib/helpers'
  import Icon from '@iconify/svelte'
import { getModalStore } from '@skeletonlabs/skeleton'; const modalStore = getModalStore();
  import { DataHandler } from '@vincjo/datatables'
  import { onMount } from 'svelte'
  import ModalFormForma from './ModalFormForma.svelte'
  export let data
  function formasRearrange(formas) {
    return formas.map((v) => {
      let var_taxa,
        min_taxa = undefined,
        max_taxa = undefined
      if (v.taxa_encargo !== undefined) {
        var_taxa = formatTaxa(v.taxa_encargo) + '%'
      } else {
        for (let i = 0; i < v.parcelamentos.length; i++) {
          const p = v.parcelamentos[i]
          min_taxa = min_taxa == undefined || p.taxa_encargo < min_taxa ? p.taxa_encargo : min_taxa
          max_taxa = max_taxa == undefined || p.taxa_encargo > max_taxa ? p.taxa_encargo : max_taxa
        }
        var_taxa = min_taxa != max_taxa ? `${formatTaxa(min_taxa)} ~ ${formatTaxa(max_taxa)}%` : formatTaxa(max_taxa) + '%'
      }
      return { ...v, var_taxa }
    })
  }

  const handler = new DataHandler([], { rowsPerPage: 10 })
  $: handler.setRows(formasRearrange(data.formas || []))
  const rows = handler.getRows()
  $: contas = data.contas || []

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormForma, props: { modo: 'adicionar', formData: data.formAdicionar, contas } }
    })
  }
  function handleEditar(row) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormForma, props: { modo: 'editar', initialData: { ...row }, formData: data.formEditar, contas } }
    })
  }
  onMount(() => handler.sortAsc('nome'))
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Formas de Transação</h1>
    <button class="btn variant-filled-primary h-min" on:click={handleAdicionar}>
      <Icon icon="fa6-solid:plus" />
      <span>Adicionar</span>
    </button>
  </div>

  <DataTable {handler}>
    <table class="table table-compact table-hover text-center">
      <thead class="!bg-surface-300-600-token whitespace-nowrap">
        <tr class="!text-center">
          <TH orderBy={(row) => contas.find((v) => v.id === row.conta_id)?.nome}>Conta</TH>
          <TH orderBy="nome">Forma de Transação</TH>
          <TH orderBy="var_taxa">Taxa de Encargo</TH>
          <TH orderBy="pode_receber">Receber</TH>
          <TH orderBy="pode_pagar">Pagar</TH>
          <TH orderBy="pode_parcelar">Parcelável</TH>
          <TH orderBy={(row) => !row.delecao}>Status</TH>
          <th>Ações</th>
        </tr>
        <tr>
          <THF filterBy={(row) => contas.find((v) => v.id === row.conta_id)?.nome} />
          <THF filterBy="nome" />
          <th class="w-0" />
          <th class="w-0" />
          <th class="w-0" />
          <th class="w-0" />
          <td class="w-0" />
          <td class="w-0" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{contas.find((v) => v.id === row.conta_id)?.nome ?? ''}</td>
            <td>{row.nome ?? ''}</td>
            <td>{row.var_taxa ?? ''}</td>
            <td><CheckMark percent={row.pode_receber} /></td>
            <td><CheckMark percent={row.pode_pagar} /></td>
            <td><CheckMark percent={row.pode_parcelar} /></td>
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
