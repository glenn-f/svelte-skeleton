<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { FE_VENDA, PE_PERDA, PE_VENDA, PE_VENDA_COM_BUYBACK, mapCondicao, mapEstadoEstoque, mapFEPerdas, mapFluxoEstoque, mapOrigem } from '$lib/globals'
  import { formatInteger, formatMoeda } from '$lib/helpers'
  import { addItemSaidaSchema } from '$lib/zod/schemas/estoque'
  import { Autocomplete, getModalStore } from '@skeletonlabs/skeleton'
  import { Searcher } from 'fast-fuzzy'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let produtos, store, colaboradores, labelTitle

  const modalStore = getModalStore()
  let buscarProduto, produtoSelecionado, inputSearch, filtroCondicao, filtroOrigem, filtroEstado, filtroGeral, estoqueSelecionado
  const itemInitial = { tipo_fe: undefined, qntd: 1, valor: undefined, responsavel_id: $store.responsavel_id, observacoes: undefined }

  let item = { ...itemInitial }
  let errors = {}
  let errorMessage = ''
  $: produtosAutocomplete = updateProdutoList($produtos)
  let searcher,
    itens,
    timeout,
    itensFiltrados,
    lastChange = Date.now()

  function updateProdutoList(prods) {
    const tmp = []
    prods?.forEach((v, k) => {
      const { id, qntd_carrinho, nome, qntd, preco_medio } = v
      const disp = qntd - qntd_carrinho
      if (disp > 0) {
        const label = nome + ` (${disp} disponível` + (qntd_carrinho > 0 ? ` +${qntd_carrinho} na saída)` : ')') + (preco_medio > 0 ? ' → ' + formatMoeda(preco_medio) + ' (preço médio)' : '')
        tmp.push({ label, value: id, meta: v })
      }
    })
    return tmp
  }

  function onSelection(event) {
    produtoSelecionado = event.detail.meta
    searcher = new Searcher(produtoSelecionado.estoque, { keySelector, ignoreCase: true })
    filtrarItens(filtroCondicao, filtroEstado, filtroOrigem)
    buscarProduto = ''
  }
  const keySelector = (o) => [o.codigo ?? '', o.observacoes ?? '']
  //!
  function handleAdicionar() {
    if (isVenda) {
      item.tipo_fe = FE_VENDA
    } else if (isPerda) {
      item.tipo_fe = parseInt(item.tipo_fe)
      item.valor = 0
      item.responsavel_id = undefined
    }
    const validation = addItemSaidaSchema.safeParse({ estoque: estoqueSelecionado, id: estoqueSelecionado.id, ...item })

    if (validation.success) {
      const { id, produto_id } = estoqueSelecionado
      const qntd = validation.data.qntd
      $produtos.get(produto_id).estoque.get(id).qntd_carrinho += qntd
      $produtos.get(produto_id).qntd_carrinho += qntd
      $store.estoque_saida = [...$store.estoque_saida, validation.data]
      modalStore.close()
    } else {
      errors = { ...validation.error?.flatten()?.fieldErrors }
    }
  }
  function handleResetar() {
    produtoSelecionado = undefined
    searcher = undefined
    handleEscolherOutro()
  }
  function handleEscolherOutro() {
    estoqueSelecionado = undefined
    filtroCondicao = undefined
    filtroEstado = undefined
    filtroOrigem = undefined
    filtroGeral = undefined
  }
  function onEstoqueChange(e) {
    produtosAutocomplete = updateProdutoList($produtos)
    if (e) {
      item.qntd = 1
      item.valor = e.preco_unitario ?? undefined
    } else {
      searcher = undefined
      itens = undefined
      clearInterval(timeout)
      itensFiltrados = undefined
      item = { ...itemInitial }
    }
    filtrarItens(filtroCondicao, filtroEstado, filtroOrigem)
    errors = {}
    errorMessage = ''
  }

  //*!

  function filtrarItens(filtroCondicao, filtroEstado, filtroOrigem) {
    if (!produtoSelecionado) return
    itens = []
    produtoSelecionado.estoque.forEach((e) => {
      const { estado, origem, condicao } = e
      if (filtroCondicao && filtroCondicao !== condicao) return
      if (filtroEstado && filtroEstado !== estado) return
      if (filtroOrigem && filtroOrigem !== origem) return
      itens.push(e)
    })
    searcher = new Searcher(itens, { keySelector, ignoreCase: true })
    _filtrarTexto(filtroGeral)
  }
  function filtrarTexto(f) {
    if (!produtoSelecionado || !f || !itens) return
    const change = lastChange + 200 - Date.now()
    if (change > 0) {
      clearTimeout(timeout)
      timeout = setTimeout(() => filtrarTexto(f), change)
      return
    }
    _filtrarTexto(f)
  }

  function _filtrarTexto(f) {
    itensFiltrados = itens
    if (!searcher || !produtoSelecionado) return
    if (f?.trim()) {
      itensFiltrados = searcher.search(f.trim())
    }
    lastChange = Date.now()
  }
  $: isVenda = $store.tipo_pe === PE_VENDA || $store.tipo_pe === PE_VENDA_COM_BUYBACK
  $: isPerda = $store.tipo_pe === PE_PERDA
  $: if (!produtoSelecionado) inputSearch?.focus()
  $: onEstoqueChange(estoqueSelecionado)
  $: filtrarItens(filtroCondicao, filtroEstado, filtroOrigem)
  $: filtrarTexto(filtroGeral)
</script>

<CardModal width="w-full max-w-screen-xl">
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Item ({labelTitle})</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    <div class="col-span-12 grid grid-cols-12 gap-2">
      {#if produtoSelecionado}
        <div class="col-span-5">
          <ShowBox label="Produto Selecionado">
            {produtoSelecionado?.nome}
          </ShowBox>
        </div>
        <div class="col-span-5">
          <ShowBox label="Categoria">
            {produtoSelecionado?.categoria ?? '-'}
          </ShowBox>
        </div>
        <div class="col-span-2 self-end justify-self-center">
          <Button text="Resetar" icon="fa6-solid:xmark" class="variant-filled-warning" on:click={handleResetar} />
        </div>

        {#if !estoqueSelecionado}
          <!-- <div class="col-span-12 flex gap-2 items-center">
            <hr width="100%" />
            <h4 class="h4 text-center whitespace-nowrap">Listagem de Itens em Estoque</h4>
            <hr width="100%" />
          </div> -->
          <div class="col-span-2">
            <InputSelect label="Filtro Condição" bind:value={filtroCondicao} options={mapCondicao} placeholder="Todos" placeholderEnabled />
          </div>
          <div class="col-span-2">
            <InputSelect label="Filtro Origem" bind:value={filtroOrigem} options={mapOrigem} placeholder="Todos" placeholderEnabled />
          </div>
          <div class="col-span-2">
            <InputSelect label="Filtro Estado" bind:value={filtroEstado} options={mapEstadoEstoque} placeholder="Todos" placeholderEnabled />
          </div>
          <div class="col-span-5">
            <InputText label="Buscar..." placeholder="Digite o código ou observações" bind:value={filtroGeral} />
          </div>
          <div class="col-span-1 self-end justify-self-center">
            <IconButton on:click={handleEscolherOutro} icon="fa6-solid:xmark" class="btn-icon variant-ghost-warning" width="20px" data-tooltip="Limpar Filtros" data-placement="left" />
          </div>
          <div class="col-span-12 table-container border-token border-surface-500">
            <table class="table table-compact table-hover table-interactive">
              <thead>
                <tr>
                  <th class="w-0" />
                  <th>Estado</th>
                  <th>Origem</th>
                  <th>Condição</th>
                  <th>Observações</th>
                  <th>Código</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Custo Unit.</th>
                </tr>
              </thead>
              <tbody>
                {#each itensFiltrados ?? [] as e, i}
                  {#if e.qntd - e.qntd_carrinho > 0}
                    <tr data-tooltip="Escolher este item" on:click={() => (estoqueSelecionado = e)}>
                      <td>{mapEstadoEstoque.get(e.estado)}</td>
                      <td>{mapOrigem.get(e.origem)}</td>
                      <td>{mapCondicao.get(e.condicao)}</td>
                      <td>{e.observacoes ?? ''}</td>
                      <td>{e.codigo ?? ''}</td>
                      <td>{formatInteger(e.qntd - e.qntd_carrinho)}</td>
                      <td>{formatMoeda(e.preco_unitario)}</td>
                      <td>{formatMoeda(e.custo / (e.qntd - e.qntd_carrinho))}</td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="col-span-2">
            <ShowBox label="Origem">
              {mapOrigem.get(estoqueSelecionado.estado)}
            </ShowBox>
          </div>
          <div class="col-span-2">
            <ShowBox label="Condição">
              {mapCondicao.get(estoqueSelecionado.condicao)}
            </ShowBox>
          </div>
          <div class="col-span-2">
            <ShowBox label="Estado Atual">
              {mapEstadoEstoque.get(estoqueSelecionado.estado)}
            </ShowBox>
          </div>
          <div class="col-span-3">
            <ShowBox label={'Código' + (produtoSelecionado.titulo_codigo ? ` (${produtoSelecionado.titulo_codigo})` : '')}>
              {estoqueSelecionado.codigo ?? ''}
            </ShowBox>
          </div>
          <div class="col-span-3 self-end justify-self-center">
            <Button text="Escolher Outro" icon="fa6-solid:rotate" class="variant-ghost-warning text-token" on:click={handleEscolherOutro} />
          </div>
          <div class="col-span-2">
            <ShowBox label="Custo Unitário">
              {formatMoeda(estoqueSelecionado.custo / estoqueSelecionado.qntd)}
            </ShowBox>
          </div>
          <div class="col-span-10">
            <ShowBox label="Observações">
              {estoqueSelecionado.observacoes ?? ''}
            </ShowBox>
          </div>
          <div class="col-span-3">
            <ShowBox label="Qntd. Disponível">
              {formatInteger(estoqueSelecionado.qntd)}
            </ShowBox>
          </div>
          <div class="col-span-3">
            <InputNumber label={`Qntd. ${isPerda ? "Perdida": "Vendida"}`} bind:value={item.qntd} error={errors.qntd} required />
          </div>
          <div class="col-span-3">
            {#if isVenda}
              <ShowBox label="Preço Unit. Recomendado">
                {formatMoeda(estoqueSelecionado.preco_unitario) ?? '-'}
              </ShowBox>
            {/if}
          </div>
          <div class="col-span-3">
            {#if isVenda}
              <InputMoeda label="Preço Unit. Final" bind:value={item.valor} error={errors.valor} required />
            {/if}
          </div>
          <div class="col-span-4">
            {#if isVenda}
              <InputSelect
                label="Vendedor"
                placeholder="Selecione..."
                placeholderEnabled
                options={colaboradores}
                getOptionLabel={(o) => o.nome}
                getOptionValue={(o) => o.id}
                bind:value={item.responsavel_id}
                error={errors.responsavel_id}
              />
            {:else if $store.tipo_pe === PE_PERDA}
              <InputSelect label="Forma de Perda" options={mapFEPerdas} bind:value={item.tipo_fe} error={errors.tipo_fe} placeholder="Selecione..." placeholderEnabled required />
            {/if}
          </div>
          <div class="col-span-8">
            <InputText label={`Detalhes da saída deste estoque (${labelTitle})`} bind:value={item.observacoes} error={errors.observacoes} />
          </div>
        {/if}
      {:else}
        <div class="col-span-12">
          <input bind:this={inputSearch} class="input" type="search" name="demo" bind:value={buscarProduto} placeholder="Buscar produto..." />
          <div class="card w-full max-h-40 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete emptyState="Nenhum item encontrado." bind:input={buscarProduto} options={produtosAutocomplete} on:selection={onSelection} />
          </div>
        </div>
      {/if}
    </div>
  </section>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      {#if estoqueSelecionado}
        <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      {/if}
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
