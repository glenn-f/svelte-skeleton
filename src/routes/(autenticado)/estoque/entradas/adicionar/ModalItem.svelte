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
  export let produtosAutocomplete, store
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
        <div class="col-span-5">
          <InputMoeda label="Custo Unitário" bind:value={item.custo_unitario} error={errors.custo_unitario} required />
        </div>
        <div class="col-span-5">
          <InputSelect label="Estado Inicial" bind:value={item.estado} error={errors.estado} options={mapEstadoEstoque} required />
        </div>
        <div class="col-span-7">
          <InputText label={'Código' + (produtoSelecionado.titulo_codigo ? ` (${produtoSelecionado.titulo_codigo})` : '')} bind:value={item.codigo} error={errors.codigo} />
        </div>
        <div class="col-span-5">
          <InputMoeda label="Preço Unitário" bind:value={item.preco_unitario} required={item.estado === EE_DISPONIVEL} error={errors.preco_unitario} />
        </div>
        <div class="col-span-12">
          <InputText label="Observações" bind:value={item.observacoes} error={errors.observacoes} />
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
