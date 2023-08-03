<script>
  import { goto } from '$app/navigation'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { mapCondicao, mapEstadoEstoque, mapFluxoContabil, mapFluxoContabilClasse, mapOrigem } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import ModalItem from './ModalItem.svelte'
  import ModalPgto from './ModalPgto.svelte'
  import { triggerMessage } from '$lib/client'
  export let data

  const { form, errors, enhance } = superForm(data.form, {
    dataType: 'json',
    taintedMessage: false,
    resetForm: true,
    onResult: async (event) => {
      triggerMessage(event)
      if (event.result.type == 'success') {
        goto('/estoque/entradas', { invalidateAll: true })
      }
    }
  })

  $: colaboradores = data.colaboradores || []
  $: fornecedores = data.fornecedores || []
  $: produtos = data.produtos || []
  $: formas = data.formas || []
  $: mapFormas = formasMap(formas)
  $: produtosAutocomplete = produtos?.map((p) => ({ label: p.nome, value: p.id, meta: p }))
  $: totalCusto = $form.estoque?.reduce((acc, e) => e.custo + acc, 0) ?? 0
  $: totalItens = $form.estoque?.reduce((acc, e) => e.qntd + acc, 0) ?? 0
  $: totalPago = $form.transacoes?.reduce((acc, e) => e.valor + acc, 0) ?? 0
  $: totalContabil = $form.contabil?.reduce((acc, e) => e.valor + acc, 0) ?? 0

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
  function abrirModalItem() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalItem, props: { modo: 'adicionar', entrada: form, produtosAutocomplete } }
    })
  }
  function abrirModalPgto() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalPgto, props: { modo: 'adicionar', entrada: form, formas } }
    })
  }
  function apagarItem(index) {
    $form.estoque = $form.estoque.filter((o, i) => i !== index)
  }
  function apagarPgto(index) {
    $form.transacoes = $form.transacoes.filter((o, i) => i !== index)
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

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class='flex flex-nowrap gap-1 items-center justify-center'><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/entradas">Entradas</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Adicionar</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center">
      <!-- Titulo da Página -->
      <h2 class="h2 text-center mr-3">Adicionar Entrada de Estoque</h2>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <!-- Campos Gerais -->
      <div class="xl:col-span-8 col-span-12">
        <InputText placeholder="Digite aqui observações sobre esta entrada..." error={$errors.observacoes} label="Observações e Anotações" bind:value={$form.observacoes} />
      </div>
      <div class="xl:col-span-2 col-span-6">
        <InputSelect
          label="Colaborador Responsável"
          error={$errors.responsavel_id}
          placeholder="Selecione..."
          bind:value={$form.responsavel_id}
          options={colaboradores}
          {getOptionLabel}
          {getOptionValue}
          {getDisabled}
          placeholderEnabled
        />
      </div>
      <div class="xl:col-span-2 col-span-6">
        <InputSelect
          label="Fornecedor"
          error={$errors.participante_id}
          placeholder="Selecione..."
          placeholderEnabled
          bind:value={$form.participante_id}
          options={fornecedores}
          {getOptionLabel}
          {getOptionValue}
          {getDisabled}
        />
      </div>
      <!--* Itens -->
      <div class="groupbox col-span-12 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
        <div class="col-span-12 flex justify-between items-center">
          <h4 class="h4 whitespace-nowrap">Itens da Entrada</h4>
          <hr class="w-full mx-2 !border-primary-300-600-token" />
          <button type="button" class="btn variant-filled" on:click={abrirModalItem}>
            <Icon icon="fa6-solid:plus" />
            <span>Item</span>
          </button>
        </div>
        <!--* Tabela Itens -->
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
              {#each $form.estoque as { produto_id, qntd, custo, preco_unitario, estado, condicao, origem, codigo, observacoes }, i}
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
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.estoque?._errors} />
        </div>
      </div>
      <!--! Esquerda -->
      <div class="groupbox col-span-12 xl:col-span-7 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
        <div class="col-span-12 flex justify-between items-center gap-2">
          <h4 class="h4 whitespace-nowrap">Outros Lançamentos</h4>
          <hr class="w-full !border-primary-300-600-token" />
          <button type="button" class="btn variant-filled" on:click={null}>
            <Icon icon="fa6-solid:plus" />
            <span>Receita</span>
          </button>
          <button type="button" class="btn variant-filled" on:click={null}>
            <Icon icon="fa6-solid:plus" />
            <span>Custo</span>
          </button>
        </div>
        <!--* Tabela Itens -->
        <div class="col-span-12">
          <table class="table table-compact table-hover text-center">
            <thead>
              <tr class="!text-center whitespace-nowrap">
                <th>Classe</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Observações</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {#each $form.estoque as { classe_fc, tipo_fc, valor, observacoes }, i}
                <tr>
                  <td>{mapFluxoContabilClasse.get(classe_fc)}</td>
                  <td>{mapFluxoContabil.get(tipo_fc)}</td>
                  <td>{formatMoeda(valor)}</td>
                  <td>{observacoes}</td>
                  <td class="!whitespace-nowrap">
                    <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarItem(i)}><Icon icon="fa6-solid:trash" /></button>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="100" class="variant-glass">Nenhum custo ou receita adicionado.</td>
                </tr>
              {/each}
            </tbody>
            <tfoot class="!variant-soft">
              <tr class="!text-center">
                <th colspan="2" class="text-right">Total</th>
                <td>{formatMoeda(totalContabil)}</td>
                <td colspan="100" />
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.estoque?._errors} />
        </div>
      </div>
      <!--! Direita -->
      <div class="groupbox col-span-12 xl:col-span-5 grid grid-cols-12 place-content-start gap-2">
        <div class="col-span-12 flex justify-between items-center">
          <h4 class="h4 whitespace-nowrap">Pagamentos Efetuados</h4>
          <hr class="w-full mx-2 !border-primary-300-600-token" />
          <button type="button" class="btn variant-filled" on:click={abrirModalPgto}>
            <Icon icon="fa6-solid:plus" />
            <span>Pagamento</span>
          </button>
        </div>
        <div class="col-span-12">
          <!--* Tabela Pagamentos -->
          <table class="table table-compact table-hover text-center">
            <thead>
              <tr class="!text-center whitespace-nowrap">
                <th>Forma de Transação</th>
                <th>Valor Pagamento</th>
                <th class="w-0">#</th>
              </tr>
            </thead>
            <tbody>
              {#each $form.transacoes as { forma_transacao_id, valor }, i}
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
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.transacoes?._errors} />
        </div>
      </div>

      <form method="POST" use:enhance class="col-span-12 grid gap-2 text-center">
        <div class="col-span-full">
          <HelperMessage error={$errors._errors} />
        </div>
        <div class="col-span-full">
          <button type="submit" class="btn bg-gradient-to-br from-lime-500 to-orange-400 w-min">
            <span>✓</span>
            <p>Enviar</p>
          </button>
        </div>
      </form>
      <!-- *Debugger -->
      <!-- <div class="col-span-12">
        <SuperDebug data={{ $errors, $form }} />
      </div> -->
    </div>
  </div>
</div>
