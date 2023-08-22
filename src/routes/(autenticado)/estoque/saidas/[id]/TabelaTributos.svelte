<script>
  import VariacaoNumero from '$lib/components/VariacaoNumero.svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  export let data

  $: entrada = data.entrada || {}
  $: tributos = entrada.tributos || []
  $: totalTributos = -tributos.reduce((acc, v) => acc + v.valor, 0)
</script>

<div class="col-span-12 flex items-center">
  <h3 class="h3 text-center mr-3">Tributos</h3>
</div>

<div class="col-span-12 table-container border border-surface-600">
  <table class="table table-hover text-center">
    <thead>
      <tr class="!text-center whitespace-nowrap">
        <th class="w-0">EID</th>
        <th>Produto</th>
        <th>Regra Tributo</th>
        <th class="w-0">Taxa Tributo</th>
        <th class="w-0">Valor Produto</th>
        <th class="w-0">Valor Tributo</th>
        <th class="w-0">#</th>
      </tr>
    </thead>
    <tbody>
      {#each tributos ?? [] as { faturamento, estoque_id, produto_id, regra_tributo_id, produto, regra, taxa, valor }, i}
        <tr class="!whitespace-nowrap">
          <td>{estoque_id}</td>
          <td>{produto}</td>
          <td>{regra}</td>
          <td>{formatTaxa(taxa)}%</td>
          <td>{formatMoeda(faturamento)}</td>
          <td>{formatMoeda(-valor)}</td>
          <td>-</td>
        </tr>
      {:else}
        <tr>
          <td colspan="100">Nenhum tributo foi encontrado</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="!variant-soft">
      <tr class="!text-center">
        <td colspan="4" />
        <th class="text-right">Total</th>
        <td><VariacaoNumero value={totalTributos} type="currency" /></td>
        <td />
      </tr>
    </tfoot>
  </table>
</div>
