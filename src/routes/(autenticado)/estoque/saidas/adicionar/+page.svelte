<script>
  import { goto } from '$app/navigation'
  import { triggerMessage } from '$lib/client'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputSelectRadio from '$lib/components/Forms/InputSelectRadio.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import {
    FCC_CUSTO,
    FCC_RECEITA,
    PES_SAIDA,
    PE_PERDA,
    PE_VENDA,
    PE_VENDA_COM_BUYBACK,
    mapCondicao,
    mapEstadoEstoque,
    mapFEPerdas,
    mapFluxoContabil,
    mapFluxoContabilClasse,
    mapOrigem
  } from '$lib/globals'
  import { formatMoeda } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import ModalContabil from './ModalContabil.svelte'
  import ModalItemSaida from './ModalItemSaida.svelte'
  import ModalPgto from './ModalRcbto.svelte'
  import { writable } from 'svelte/store'
  import ModalItemBuyback from './ModalItemBuyback.svelte'
  export let data
  let inputForm
  const { form, errors, enhance, submitting } = superForm(data.form, {
    dataType: 'json',
    taintedMessage: false,
    resetForm: true,
    onResult: async (event) => {
      triggerMessage(event)
      if (event.result.type == 'success') {
        const id = event.result.data.form.data
        await goto(`/estoque/saidas/${id}`, { invalidateAll: true })
      }
    }
  })

  const produtos = writable(data.produtos)
  $: produtosEntrada = data.produtosEntrada || []
  $: buybackAutocomplete = produtosEntrada?.map((p) => ({ label: p.nome, value: p.id, meta: p }))
  $: eMap = estoquesMap($produtos)
  $: colaboradores = data.colaboradores || []
  $: clientes = data.clientes || []
  $: formas = data.formas || []
  $: mapFormas = formasMap(formas)
  $: isVenda = [PE_VENDA_COM_BUYBACK, PE_VENDA].includes($form.tipo_pe)
  $: isPerda = $form.tipo_pe === PE_PERDA
  $: hasBuyback = $form.tipo_pe === PE_VENDA_COM_BUYBACK
  $: totalSaida = $form.estoque_saida?.reduce((acc, e) => e.valor * e.qntd + acc, 0) ?? 0
  $: totalItens = $form.estoque_saida?.reduce((acc, e) => e.qntd + acc, 0) ?? 0
  $: totalBuyback = hasBuyback ? $form.buyback?.reduce((acc, e) => e.custo + acc, 0) ?? 0 : 0
  $: totalRecebido = $form.transacoes?.reduce((acc, e) => e.valor + acc, 0) ?? 0
  $: totalOutrosCustos = $form.contabil?.reduce((acc, e) => (e.classe_fc == FCC_CUSTO ? e.valor : 0) + acc, 0) ?? 0
  $: totalOutrasReceitas = $form.contabil?.reduce((acc, e) => (e.classe_fc == FCC_RECEITA ? e.valor : 0) + acc, 0) ?? 0
  $: totalFinal = isPerda ? 0 : totalSaida + totalOutrasReceitas - (totalOutrosCustos + totalRecebido + totalBuyback)
  $: labelItem = isVenda ? 'Venda' : isPerda ? 'Perda' : 'Saída'
  function estoquesMap(prods) {
    const tmp = new Map()
    prods.forEach((p) => {
      p.estoque.forEach((e) => {
        tmp.set(e.id, { ...e, produto: p.nome, categoria: p.categoria })
      })
    })
    return tmp
  }

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
  function abrirModalItemSaida() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalItemSaida, props: { modo: 'adicionar', store: form, produtos, colaboradores, labelTitle: labelItem } }
    })
  }
  function abrirModalItemBuyback() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalItemBuyback, props: { modo: 'adicionar', store: form, produtos: produtosEntrada, buybackAutocomplete } }
    })
  }
  function abrirModalContabil(classe) {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalContabil, props: { modo: 'adicionar', store: form, classe } }
    })
  }
  function abrirModalRcbto() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalPgto, props: { modo: 'adicionar', store: form, formas, totalFinal } }
    })
  }
  function abrirModalConfirmacao() {
    modalStore.trigger({
      type: 'confirm',
      title: 'Confirmar Operação',
      body: 'Tem certeza que deseja continuar?',
      buttonTextCancel: 'Cancelar',
      buttonTextConfirm: 'Confirmar',
      response: (confirmado) => (confirmado ? inputForm.requestSubmit() : 0)
    })
  }
  function apagarItem(index) {
    const { id, qntd } = $form.estoque_saida[index]
    const pid = eMap.get(id).produto_id
    $produtos.get(pid).qntd_carrinho -= qntd
    $produtos.get(pid).estoque.get(id).qntd_carrinho -= qntd
    $form.estoque_saida = $form.estoque_saida.filter((o, i) => i !== index)
  }
  function apagarItemBuyback(index) {
    $form.buyback = $form.buyback.filter((o, i) => i !== index)
  }
  function apagarPgto(index) {
    $form.transacoes = $form.transacoes.filter((o, i) => i !== index)
  }
  function apagarContabil(index) {
    $form.contabil = $form.contabil.filter((o, i) => i !== index)
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
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/saidas">Saídas</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Adicionar</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center">
      <!-- Titulo da Página -->
      <h2 class="h2 text-center mr-3">Adicionar Saída de Estoque</h2>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <!-- Campos Gerais -->
      <div class="col-span-12 grid place-content-center">
        <InputSelectRadio label="Forma de Saída" bind:value={$form.tipo_pe} options={PES_SAIDA} error={$errors.tipo_pe} required />
      </div>
      <div class="xl:col-span-8 col-span-12">
        <InputText placeholder="Digite aqui observações sobre esta saída..." error={$errors.observacoes} label="Observações e Anotações" bind:value={$form.observacoes} />
      </div>
      <div class={isVenda ? 'xl:col-span-2 col-span-6' : 'xl:col-span-4 col-span-12'}>
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
      {#if isVenda}
        <div class="xl:col-span-2 col-span-6">
          <InputSelect
            label="Cliente"
            error={$errors.participante_id}
            placeholder="Selecione..."
            placeholderEnabled
            bind:value={$form.participante_id}
            options={clientes}
            {getOptionLabel}
            {getOptionValue}
            {getDisabled}
          />
        </div>
      {/if}
      <!--* Itens Saida -->
      <div class="groupbox col-span-12 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
        <div class="col-span-12 flex justify-between items-center">
          <h4 class="h4 whitespace-nowrap">Produtos {isPerda ? 'Perdidos' : 'Vendidos'}</h4>
          <hr class="w-full mx-2 !border-primary-300-600-token" />
          <button type="button" class="btn btn-sm variant-filled" on:click={abrirModalItemSaida}>
            <Icon icon="fa6-solid:plus" />
            <span>{labelItem}</span>
          </button>
        </div>
        <!--* Tabela Itens -->
        <div class="col-span-12">
          <table class="table table-compact table-hover text-center">
            <thead>
              <tr class="!text-center whitespace-nowrap">
                {#if isPerda}
                  <th class="w-0">Tipo de Perda</th>
                  <th class="w-0">Observações</th>
                {:else}
                  <th class="w-0">Vendedor</th>
                {/if}
                <th class="w-0">Estado</th>
                <th class="w-0">Origem</th>
                <th class="w-0">Condição</th>
                <th>Produto</th>
                <th>Código</th>
                <th class="w-0">Qntd</th>
                {#if !isPerda}
                  <th class="w-0">Preço Unit.</th>
                  <th class="w-0">Preço Total</th>
                {/if}

                <th class="w-0">#</th>
              </tr>
            </thead>
            <tbody>
              {#each $form.estoque_saida ?? [] as { tipo_fe, id, valor, qntd, responsavel_id, observacoes }, i}
                <tr>
                  {#if isPerda}
                    <td>{mapFEPerdas.get(tipo_fe)}</td>
                    <td>{observacoes ?? ''}</td>
                  {:else}
                    <td>{colaboradores.find((v) => v.id == responsavel_id)?.nome ?? ''}</td>
                  {/if}
                  <td>{mapEstadoEstoque.get(eMap.get(id).estado)}</td>
                  <td>{mapOrigem.get(eMap.get(id).origem)}</td>
                  <td>{mapCondicao.get(eMap.get(id).condicao)}</td>
                  <td>{eMap.get(id).produto}</td>
                  <td class="!whitespace-nowrap">
                    {#if eMap.get(id).codigo}
                      {eMap.get(id).codigo}
                    {:else}
                      <i class="text-gray-500">-</i>
                    {/if}
                  </td>
                  <td>{qntd}</td>
                  {#if !isPerda}
                    <td>{formatMoeda(valor)}</td>
                    <td>{formatMoeda(valor * qntd)}</td>
                  {/if}
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
                {#if isPerda}
                  <th>Totais</th>
                {/if}
                <th colspan="6" class="text-right">Totais</th>
                <td>{totalItens}</td>
                {#if !isPerda}
                  <td />
                  <td>{totalItens}</td>
                {/if}
                <td colspan="100" />
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.estoque_saida?._errors} />
        </div>
      </div>
      {#if $form.tipo_pe === PE_VENDA_COM_BUYBACK}
        <div class="groupbox col-span-12 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
          <div class="col-span-12 flex justify-between items-center">
            <h4 class="h4 whitespace-nowrap">Produtos Recebidos em Buyback</h4>
            <hr class="w-full mx-2 !border-primary-300-600-token" />
            <button type="button" class="btn btn-sm variant-filled" on:click={abrirModalItemBuyback}>
              <Icon icon="fa6-solid:plus" />
              <span>Buyback</span>
            </button>
          </div>
          <div class="col-span-12">
            <table class="table table-compact table-hover text-center">
              <thead>
                <tr class="!text-center whitespace-nowrap">
                  <th class="w-0">Origem</th>
                  <th class="w-0">Condição</th>
                  <th>Observações</th>
                  <th>Produto</th>
                  <th class="w-0">Código</th>
                  <th class="w-0">Qntd</th>
                  <th class="w-0">Custo Unit.</th>
                  <th class="w-0">Custo Total</th>
                  <th class="w-0">#</th>
                </tr>
              </thead>
              <tbody>
                {#each $form.buyback ?? [] as { produto_id, qntd, custo, estado, condicao, origem, codigo, observacoes }, i}
                  <tr>
                    <td>{mapOrigem.get(origem)}</td>
                    <td>{mapCondicao.get(condicao)}</td>
                    <td>{observacoes ?? ''}</td>
                    <td>{produtosEntrada.find((v) => v.id == produto_id)?.nome}</td>
                    <td class="!whitespace-nowrap">
                      {#if codigo}
                        {codigo}
                      {:else}
                        <i class="text-gray-500">-</i>
                      {/if}
                    </td>
                    <td>{qntd}</td>
                    <td>{formatMoeda(custo / qntd)}</td>
                    <td>{formatMoeda(custo)}</td>
                    <td class="!whitespace-nowrap">
                      <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarItemBuyback(i)}><Icon icon="fa6-solid:trash" /></button>
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
                  <th colspan="5" class="text-right">Totais</th>
                  <td>{totalItens}</td>
                  <td />
                  <td>{formatMoeda(totalSaida)}</td>
                  <td colspan="100" />
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="col-span-12 text-center">
            <HelperMessage error={$errors.buyback?._errors} />
          </div>
        </div>
      {/if}
      <!--! Esquerda -->
      {#if isVenda}
        <div class="groupbox col-span-12 xl:col-span-7 grid grid-cols-12 gap-2 place-content-start overflow-x-auto">
          <div class="col-span-12 flex justify-between items-center gap-2">
            <h4 class="h4 whitespace-nowrap">Outros Lançamentos</h4>
            <hr class="w-full !border-primary-300-600-token" />
            <button type="button" class="btn btn-sm variant-filled" on:click={() => abrirModalContabil(FCC_RECEITA)}>
              <Icon icon="fa6-solid:plus" />
              <span>Receita</span>
            </button>
            <button type="button" class="btn btn-sm variant-filled" on:click={() => abrirModalContabil(FCC_CUSTO)}>
              <Icon icon="fa6-solid:plus" />
              <span>Desconto</span>
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
                  <th class="w-0">#</th>
                </tr>
              </thead>
              <tbody>
                {#each $form.contabil ?? [] as { classe_fc, tipo_fc, valor, observacoes }, i}
                  <tr>
                    <td>{mapFluxoContabilClasse.get(classe_fc)}</td>
                    <td>{mapFluxoContabil.get(tipo_fc)}</td>
                    <td>{formatMoeda(valor)}</td>
                    <td class="max-w-[50ch] overflow-ellipsis overflow-hidden">{observacoes ?? ''}</td>
                    <td class="!whitespace-nowrap">
                      <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarContabil(i)}><Icon icon="fa6-solid:trash" /></button>
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
                  <td>{formatMoeda(totalOutrosCustos)}</td>
                  <td colspan="100" />
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="col-span-12 text-center">
            <HelperMessage error={$errors.contabil?._errors} />
          </div>
        </div>
        <!--! Direita -->
        <div class="groupbox col-span-12 xl:col-span-5 grid grid-cols-12 place-content-start gap-2">
          <div class="col-span-12 flex justify-between items-center">
            <h4 class="h4 whitespace-nowrap">Transações Efetuadas</h4>
            <hr class="w-full mx-2 !border-primary-300-600-token" />
            <button type="button" class="btn btn-sm variant-filled" on:click={abrirModalRcbto}>
              <Icon icon="fa6-solid:plus" />
              <span>Recebimento</span>
            </button>
          </div>
          <div class="col-span-12">
            <!--* Tabela Recebimentos -->
            <table class="table table-compact table-hover text-center">
              <thead>
                <tr class="!text-center whitespace-nowrap">
                  <th>Forma de Transação</th>
                  <th>Valor Recebimento</th>
                  <th class="w-0">#</th>
                </tr>
              </thead>
              <tbody>
                {#each $form.transacoes ?? [] as { forma_transacao_id, valor }, i}
                  <tr>
                    <td>{mapFormas.get(forma_transacao_id)}</td>
                    <td>{formatMoeda(valor || 0)}</td>
                    <td class="!whitespace-nowrap">
                      <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarPgto(i)}><Icon icon="fa6-solid:trash" /></button>
                    </td>
                  </tr>
                {:else}
                  <tr>
                    <td colspan="100" class="variant-glass">Nenhum recebimento adicionado.</td>
                  </tr>
                {/each}
              </tbody>
              <tfoot class="!variant-soft">
                <tr class="!text-center">
                  <th class="text-right">Total</th>
                  <td>{formatMoeda(totalRecebido)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="col-span-12 text-center">
            <HelperMessage error={$errors.transacoes?._errors} />
          </div>
        </div>

        <div class="col-span-12 text-center">
          <HelperMessage error={$errors._errors} />
        </div>
      {/if}

      <div class="col-span-6 place-self-end">
        {#if totalItens > 0 && !isPerda}
          <table class="text-right">
            <tr>
              <th>Total da Venda</th>
              <td class="px-2">{formatMoeda(totalSaida)}</td>
              <td class="w-5 !text-center badge variant-glass-success">+</td>
            </tr>
            {#if totalOutrasReceitas !== 0}
              <tr>
                <th>Outras Receitas</th>
                <td class="px-2">{formatMoeda(totalOutrasReceitas)}</td>
                <td class="w-5 !text-center badge variant-glass-success">+</td>
              </tr>
            {/if}
            <tr>
              <th>Recebimento em Transações</th>
              <td class="px-2">{formatMoeda(totalRecebido)}</td>
              <td class="w-5 !text-center badge variant-glass-error">-</td>
            </tr>
            {#if hasBuyback}
            <tr>
              <th>Recebimento em Buybacks</th>
              <td class="px-2">{formatMoeda(totalBuyback)}</td>
              <td class="w-5 !text-center badge variant-glass-error">-</td>
            </tr>
            {/if}
            {#if totalOutrosCustos !== 0}
              <tr>
                <th>Outros Descontos</th>
                <td class="px-2">{formatMoeda(totalOutrosCustos)}</td>
              <td class="w-5 !text-center badge variant-glass-error">-</td>
              </tr>
            {/if}
            <tr>
              <td colspan="100">
                <hr />
              </td>
            </tr>
            <tr>
              <th>Total Final</th>
              <td class="px-2">{formatMoeda(totalFinal)}</td>
              {#if totalFinal === 0}
                <td class="w-5 !text-center badge variant-filled-success">✓</td>
              {:else}
                <td class="w-5 !text-center badge variant-filled-error">✕</td>
              {/if}
            </tr>
          </table>
        {/if}
      </div>

      <form bind:this={inputForm} method="POST" use:enhance class="col-span-6 self-center">
        <button
          type="submit"
          on:click|preventDefault={abrirModalConfirmacao}
          class="btn bg-gradient-to-br from-lime-500 to-orange-400 w-min"
          disabled={totalFinal !== 0 || totalItens === 0 || $submitting}
        >
          {#if $submitting}
            <Icon icon="line-md:loading-twotone-loop" width="24px" height="24px" />
            <p>Enviando...</p>
          {:else}
            <Icon icon="mdi:package-variant-closed-check" width="24px" height="24px" />
            <p>Finalizar</p>
          {/if}
        </button>
      </form>
      <!-- *Debugger -->
      <div class="col-span-12">
        <SuperDebug data={{ $form }} />
      </div>
    </div>
  </div>
</div>
