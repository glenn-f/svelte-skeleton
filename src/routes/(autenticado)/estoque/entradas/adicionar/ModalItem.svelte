<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { Autocomplete, modalStore } from '@skeletonlabs/skeleton'
  import { mapOrigem, mapCondicao, mapEstadoEstoque, EE_DISPONIVEL } from '$lib/globals'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import { addItemEntradaSchema } from '$lib/zod/schemas/estoque'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  export let produtosAutocomplete, store, regrasComissao, regrasTributo
  let buscarProduto, produtoSelecionado, inputSearch
  const itemInitial = { qntd: 1 }
  let item = { ...itemInitial }
  let errors = {}
  let errorMessage = ''

  function onSelection(event) {
    produtoSelecionado = event.detail.meta
    item.produto_id = event.detail.value
    buscarProduto = ''
  }
  function handleAdicionar() {
    const validation = addItemEntradaSchema.safeParse(item)
    if (validation.success) {
      $store.estoque = [...$store.estoque, validation.data]
      modalStore.close()
    } else {
      errors = { ...validation.error?.flatten()?.fieldErrors }
    }
  }
  function handleResetar() {
    produtoSelecionado = undefined
    item = { ...itemInitial }
    errors = {}
    errorMessage = ''
  }
  $: if (!produtoSelecionado) inputSearch?.focus()
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Item</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    <div class="col-span-12 grid grid-cols-12 gap-2">
      {#if produtoSelecionado}
        <h4 class="h4 col-span-12">Dados do Item em Entrada <hr></h4>
        <div class="col-span-9">
          <label class="label">
            <b class="text-xs">Produto Selecionado</b>
            <input type="text" class="input" readonly value={produtoSelecionado?.nome} />
          </label>
        </div>
        <div class="col-span-3 self-end">
          <button type="button" class="btn variant-filled-warning w-full" on:click={handleResetar}>
            <span>✕</span>
            <p>Resetar</p>
          </button>
        </div>
        <div class="col-span-6">
          <InputSelect label="Origem" bind:value={item.origem} error={errors.origem} options={mapOrigem} required />
        </div>
        <div class="col-span-6">
          <InputSelect label="Condição" bind:value={item.condicao} error={errors.condicao} options={mapCondicao} required />
        </div>
        <div class="col-span-2">
          <InputNumber label="Quantidade" bind:value={item.qntd} error={errors.qntd} required />
        </div>
        <div class="col-span-4">
          <InputMoeda label="Custo Unitário" bind:value={item.custo_unitario} error={errors.custo_unitario} required />
        </div>
        <div class="col-span-6">
          <InputText label={'Código' + (produtoSelecionado.titulo_codigo ? ` (${produtoSelecionado.titulo_codigo})` : '')} bind:value={item.codigo} error={errors.codigo} />
        </div>
        <div class="col-span-12">
          <InputText label="Observações" bind:value={item.observacoes} error={errors.observacoes} />
        </div>
        <h4 class="h4 col-span-12">Configurações para Venda <hr></h4>
        <div class="col-span-6">
          <InputSelect label="Estado Inicial" bind:value={item.estado} error={errors.estado} options={mapEstadoEstoque} required />
        </div>
        <div class="col-span-6">
          <InputMoeda label="Preço Unitário" bind:value={item.preco_unitario} required={item.estado === EE_DISPONIVEL} error={errors.preco_unitario} />
        </div>
        <div class="col-span-6">
          <InputSelect
            options={regrasTributo}
            getOptionLabel="nome"
            getOptionValue="id"
            getDisabled={(v) => !!v.delecao}
            label="Regra de Tributação"
            placeholder="Selecione..."
            placeholderEnabled
            name="regra_tributo_id"
            bind:value={item.regra_tributo_id}
            error={errors.regra_tributo_id}
          />
          {#if item.regra_tributo_id}
            {@const regra = regrasTributo.find((v) => v.id == item.regra_tributo_id) || {}}
            <div class="w-full ml-3 text-sm my-2">
              <b>Descrição:</b>
              {regra.descricao || '-'} <br />
              <b>Taxa:</b>
              {formatTaxa(regra.taxa_fixa)}%
            </div>
          {/if}
        </div>
        <div class="col-span-6">
          <InputSelect
            options={regrasComissao}
            getOptionLabel="nome"
            getOptionValue="id"
            getDisabled={(v) => !!v.delecao}
            label="Regra de Comissão"
            placeholder="Selecione..."
            placeholderEnabled
            name="regra_comissao_id"
            bind:value={item.regra_comissao_id}
            error={errors.regra_comissao_id}
          />
          {#if item.regra_comissao_id}
            {@const regra = regrasComissao.find((v) => v.id == item.regra_comissao_id) || {}}
            <div class="w-full ml-3 text-sm my-2">
              <b>Descrição:</b>
              {regra.descricao || '-'} <br />
              <b>Taxa:</b>
              {formatTaxa(regra.taxa_fixa)}% +
              <b>Bônus:</b>
              R$ {formatMoeda(regra.bonus_fixo)}
            </div>
          {/if}
        </div>
      {:else}
        <div class="col-span-12">
          <input bind:this={inputSearch} class="input" type="search" name="demo" bind:value={buscarProduto} placeholder="Buscar produto..." />
          <div class="card w-full max-h-40 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete emptyState="Nenhum item encontrado." bind:input={buscarProduto} options={produtosAutocomplete} on:selection={onSelection} />
          </div>
        </div>
      {/if}
    </div>
    <!-- <div class="col-span-12">
      <SuperDebug data={item} />
    </div> -->
  </section>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      {#if produtoSelecionado}
        <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      {/if}
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
