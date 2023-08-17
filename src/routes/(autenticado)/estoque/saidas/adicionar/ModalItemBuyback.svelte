<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { CONDICAO_SEMINOVO, EE_AVALIACAO, mapCondicao, mapOrigem } from '$lib/globals'
  import { addBuybackSaidaSchema } from '$lib/zod/schemas/estoque'
  import { Autocomplete, modalStore } from '@skeletonlabs/skeleton'
  export let buybackAutocomplete, store
  let buscar_produto, produto_selecionado, inputSearch
  const itemInitial = { condicao: CONDICAO_SEMINOVO, qntd: 1, estado: EE_AVALIACAO }
  let item = { ...itemInitial }
  let errors = {}
  let errorMessage = ''

  function onSelection(event) {
    produto_selecionado = event.detail.meta
    item.produto_id = event.detail.value
    buscar_produto = ''
  }
  function handleAdicionar() {
    const validation = addBuybackSaidaSchema.safeParse(item)
    if (validation.success) {
      $store.buyback = [...$store.buyback, validation.data]
      modalStore.close()
    } else {
      errors = { ...validation.error?.flatten()?.fieldErrors }
    }
  }
  function handleResetar() {
    produto_selecionado = undefined
    item = { ...itemInitial }
    errors = {}
    errorMessage = ''
  }
  $: if (!produto_selecionado) inputSearch?.focus()
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Item (Buyback)</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    <div class="col-span-12 grid grid-cols-12 gap-2">
      {#if produto_selecionado}
        <div class="col-span-9">
          <label class="label">
            <b class="text-xs">Produto Selecionado</b>
            <input type="text" class="input" readonly value={produto_selecionado?.nome} />
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
          <InputText label={'Código' + (produto_selecionado.titulo_codigo ? ` (${produto_selecionado.titulo_codigo})` : '')} bind:value={item.codigo} error={errors.codigo} />
        </div>
        <div class="col-span-12">
          <InputText label="Observações do produto" bind:value={item.observacoes} error={errors.observacoes} />
        </div>
      {:else}
        <div class="col-span-12">
          <input bind:this={inputSearch} class="input" type="search" name="demo" bind:value={buscar_produto} placeholder="Buscar produto..." />
          <div class="card w-full max-h-40 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete emptyState="Nenhum item encontrado." bind:input={buscar_produto} options={buybackAutocomplete} on:selection={onSelection} />
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
      <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
