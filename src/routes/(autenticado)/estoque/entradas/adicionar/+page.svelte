<script>
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalItem from './ModalItem.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import { writable } from 'svelte/store'
  import { mapCondicao, mapEstadoEstoque, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import ModalPgto from './ModalPgto.svelte'
  export let data
  const entrada = writable({ estoque: [], transacoes: [] })

  $: formas = data.formas || []
  $: mapFormas = formasMap(formas)
  $: produtos = data.produtos || []
  $: colaboradores = data.colaboradores || []
  $: fornecedores = data.fornecedores || []
  $: produtosAutocomplete = produtos?.map((v) => {
    return { label: v.nome, value: v.id, meta: v }
  })
  $: totalCusto = $entrada.estoque.reduce((acc, e) => e.custo + acc, 0)
  $: totalItens = $entrada.estoque.reduce((acc, e) => e.qntd + acc, 0)
  $: totalPago = $entrada.transacoes.reduce((acc, e) => e.valor + acc, 0)

  function formasMap(formas) {
    const mapa = new Map()
    for (let i = 0; i < formas?.length; i++) {
      const f = formas[i]
      if (f.parcelamentos) {
        f.parcelamentos.forEach((p) => mapa.set(p.forma_transacao_id, `${f.nome} ${p.parcela}x`))
      } else {
        mapa.set(f.forma_transacao_id, f.nome)
      }
    }
    return mapa
  }

  function modalAdicionarItem() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalItem, props: { modo: 'adicionar', entrada, produtosAutocomplete } }
    })
  }
  function modalAdicionarPgto() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalPgto, props: { modo: 'adicionar', entrada, formas } }
    })
  }

  function apagarItem(index) {
    $entrada.estoque = $entrada.estoque.filter((o, i) => i !== index)
  }
  function apagarPgto(index) {
    $entrada.transacoes = $entrada.transacoes.filter((o, i) => i !== index)
  }
  function getOptionLabel(v) {
    return v.nome
  }
  function getOptionValue(v) {
    return v.id
  }
  function getDisabled(v) {
    return v.delecao
  }
</script>

<div class="grid gap-3">
  <div class="flex items-center">
    <!-- Titulo da Página -->
    <h2 class="h2 text-center mr-3">Adicionar Entrada de Estoque</h2>
  </div>
  <div class="grid grid-cols-12 gap-2">
    <!-- Campos Gerais -->
    <div class="xl:col-span-8 col-span-12">
      <InputText placeholder="Digite aqui observações sobre esta entrada..." label="Observações e Anotações" bind:value={$entrada.observacoes} />
    </div>
    <div class="xl:col-span-2 col-span-6">
      <InputSelect
        label="Colaborador Responsável"
        placeholder="Selecione..."
        placeholderEnabled
        bind:value={$entrada.responsavel_id}
        options={colaboradores}
        {getOptionLabel}
        {getOptionValue}
        {getDisabled}
      />
    </div>
    <div class="xl:col-span-2 col-span-6">
      <InputSelect label="Fornecedor" placeholder="Selecione..." placeholderEnabled bind:value={$entrada.participante_id} options={fornecedores} {getOptionLabel} {getOptionValue} {getDisabled} />
    </div>
    <!--! Esquerda -->
    <div class="col-span-12 xl:col-span-8 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
      <div class="col-span-12 self-end justify-self-end">
        <button type="button" class="btn variant-filled" on:click={modalAdicionarItem}>Adicionar Item</button>
      </div>
      <!-- Tabela -->
      <div class="col-span-12">
        <table class="table table-compact table-hover text-center">
          <thead>
            <tr class="!text-center whitespace-nowrap">
              <th class="w-0">Origem</th>
              <th class="w-0">Condição</th>
              <th class="">Produto</th>
              <th class="w-0">Código</th>
              <th class="w-0">Qntd</th>
              <th class="w-0">Custo Unit.</th>
              <th class="w-0">Estado Inicial</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each $entrada.estoque as { produto_id, qntd, custo, preco_unitario, estado, condicao, origem, codigo, observacoes }, i}
              <tr>
                <td>{mapOrigem.get(origem)}</td>
                <td>{mapCondicao.get(condicao)}</td>
                <td>{produtos.find((v) => v.id == produto_id)?.nome}</td>
                <td class="!whitespace-nowrap">
                  {#if codigo}
                    {codigo}
                  {:else}
                    <i class="text-gray-500">-</i>
                  {/if}
                </td>
                <td>{qntd}</td>
                <td>{formatMoeda(custo / qntd)}</td>
                <td>{mapEstadoEstoque.get(estado)}</td>
                <td class="!whitespace-nowrap">
                  <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarItem(i)}><Icon icon="fa6-solid:trash" /></button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="100" class="variant-glass">Nenhum item adicionado.</td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <th colspan="4" class="text-right">Totais</th>
              <td>{totalItens}</td>
              <td>{formatMoeda(totalCusto)}</td>
              <td />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <!--! Direita -->
    <div class="col-span-12 xl:col-span-4 grid grid-cols-12 place-content-start gap-2">
      <div class="col-span-12 self-end justify-self-end">
        <button type="button" class="btn variant-filled" on:click={modalAdicionarPgto}>Adicionar Pagamento</button>
      </div>
      <div class="col-span-12">
        <table class="table table-compact table-hover text-center">
          <thead>
            <tr class="!text-center whitespace-nowrap">
              <th>Forma de Transação</th>
              <th>Valor Pagamento</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each $entrada.transacoes as { forma_transacao_id, valor }, i}
              <tr>
                <td>{mapFormas.get(forma_transacao_id)}</td>
                <td>{formatMoeda(valor || 0)}</td>
                <td class="!whitespace-nowrap">
                  <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarPgto(i)}><Icon icon="fa6-solid:trash" /></button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="100" class="variant-glass">Nenhum pagamento adicionado.</td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <th class="text-right">Total</th>
              <td>{formatMoeda(totalPago)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="col-span-12 place-self-center">
      <button type="button" class="btn bg-gradient-to-br from-lime-500 to-orange-400" disabled={totalItens == 0 || totalCusto !== totalPago}>
        <span>✓</span>
        <p>Enviar</p>
      </button>
    </div>
    <!-- *Debugger -->
    <!-- <div class="col-span-12">
      <SuperDebug data={entrada} />
    </div> -->
  </div>
</div>
