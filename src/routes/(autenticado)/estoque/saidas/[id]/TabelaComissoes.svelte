<script>
  import VariacaoNumero from '$lib/components/VariacaoNumero.svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  export let data

  $: entrada = data.entrada || {}
  $: comissoes = entrada.comissoes || []
  $: totalComissoes = -comissoes.reduce((acc, v) => acc + v.valor, 0)
</script>

<div class="col-span-12 flex items-center">
  <h3 class="h3 text-center mr-3">Comissões</h3>
</div>

<div class="col-span-12 table-container border border-surface-600">
  <table class="table table-hover text-center">
    <thead>
      <tr class="!text-center whitespace-nowrap">
        <th class="w-0">EID</th>
        <th class="w-0">Vendedor</th>
        <th>Produto</th>
        <th>Regra Comissão</th>
        <th class="w-0">Taxa Comissão</th>
        <th class="w-0">Bônus Comissão</th>
        <th class="w-0">Valor Venda</th>
        <th class="w-0">Valor Comissão</th>
        <th class="w-0">#</th>
      </tr>
    </thead>
    <tbody>
      {#each comissoes ?? [] as { faturamento, estoque_id, vendedor_id, produto_id, regra_comissao_id, produto, vendedor, regra, taxa, bonus, valor }, i}
        <tr class="!whitespace-nowrap">
          <td>{estoque_id}</td>
          <td>{vendedor}</td>
          <td>{produto}</td>
          <td>{regra}</td>
          <td>{formatTaxa(taxa)}%</td>
          <td>{formatMoeda(bonus)}</td>
          <td>{formatMoeda(faturamento)}</td>
          <td>{formatMoeda(-valor)}</td>
          <td>-</td>
        </tr>
      {:else}
        <tr>
          <td colspan="100">Nenhuma comissão foi encontrada</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="!variant-soft">
      <tr class="!text-center">
        <td colspan="6" />
        <th class="text-right">Total</th>
        <td><VariacaoNumero value={totalComissoes} type="currency" /></td>
        <td />
      </tr>
    </tfoot>
  </table>
</div>
