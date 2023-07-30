<script>
  import { Table } from '$lib/components/Table'
  import RowStatusToggle from '$lib/components/Table/RowStatusToggle.svelte'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { renderComponent } from '@tanstack/svelte-table'
  import CelulaAcoes from './CelulaAcoes.svelte'
  import ModalFormForma from './ModalFormForma.svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  import CheckMark from '$lib/components/CheckMark.svelte'
  export let data

  $: rows =
    data.formas?.map((v) => {
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
    }) || []
  $: contas = data.contas || []
  let columns = [
    { accessorKey: 'conta_id', header: 'Conta', cell: (info) => contas.find((v) => v.id === info.getValue())?.nome },
    { accessorKey: 'nome', header: 'Forma de Transação' },
    { accessorKey: 'var_taxa', header: 'Taxa de Encargo' },
    { accessorKey: 'pode_receber', header: 'Receber', cell: (info) => renderComponent(CheckMark, { percent: info.getValue() }), enableSorting: false },
    { accessorKey: 'pode_pagar', header: 'Pagar', cell: (info) => renderComponent(CheckMark, { percent: info.getValue() }), enableSorting: false },
    { accessorKey: 'pode_parcelar', header: 'Parcelável', cell: (info) => renderComponent(CheckMark, { percent: info.getValue() }), enableSorting: false },
    { header: 'Status', cell: (info) => renderComponent(RowStatusToggle, { id: info.row.original?.id, checked: !info.row.original?.delecao }), enableSorting: false },
    { header: 'Ações', cell: (info) => renderComponent(CelulaAcoes, { formData: data.formEditar, initialData: info.row.original, contas }), enableSorting: false }
  ]
  const pageSizes = [10, 25, 50]

  function handleAdicionar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: ModalFormForma,
        props: { modo: 'adicionar', formData: data.form, contas }
      }
    })
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <h1 class="h1 text-center mr-3">Formas de Transação</h1>
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
