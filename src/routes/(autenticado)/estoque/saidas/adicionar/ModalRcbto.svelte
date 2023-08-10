<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import { formatMoeda } from '$lib/helpers'
  import { addPgtoEntradaSchema } from '$lib/zod/schemas/contaFormas'
  import { modalStore } from '@skeletonlabs/skeleton'
  export let formas, store, totalFinal
  let pagamento = {}
  let errors = {}
  let errorMessage = ''

  function handleAdicionar() {
    const validation = addPgtoEntradaSchema.safeParse(pagamento)
    if (validation.success) {
      $store.transacoes = [...$store.transacoes, validation.data]
      modalStore.close()
    } else {
      errors = { ...validation.error?.flatten()?.fieldErrors }
    }
  }

  function onFormaChange(v) {
    if (v?.parcelamentos?.length > 0) {
      if (!v.parcelamentos.find((v) => v.forma_transacao_id === pagamento.forma_transacao_id)) pagamento.forma_transacao_id = undefined
    } else {
      pagamento.forma_transacao_id = v?.forma_transacao_id
    }
  }
  function definirPrecoRestante() {
    pagamento.valor = totalFinal
  }

  $: formas_parcelamentos = pagamento.forma?.parcelamentos
  $: onFormaChange(pagamento.forma)
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Recebimento</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    {#if totalFinal > 0}
      <div class="col-span-12 grid grid-cols-12">
        <div class="col-span-5">
          <button type="button" class="btn variant-filled" on:click={definirPrecoRestante}>
            Restante: R$ {formatMoeda(totalFinal)}
          </button>
        </div>
      </div>
    {/if}
    <div class="col-span-12 grid grid-cols-12 gap-2">
      <div class="col-span-5">
        <InputMoeda label="Preço Unitário" bind:value={pagamento.valor} error={errors.valor} required />
      </div>
      <div class={`col-span-${formas_parcelamentos?.length > 0 ? '5' : '7'}`}>
        <InputSelect label="Forma de Transação" bind:value={pagamento.forma} options={formas} getOptionValue={(v) => v} getOptionLabel={(v) => v.nome} error={errors.forma_transacao_id} required />
      </div>
      {#if formas_parcelamentos?.length > 0}
        <div class="col-span-2">
          <InputSelect
            label="Parcelamento"
            bind:value={pagamento.forma_transacao_id}
            options={formas_parcelamentos}
            getOptionValue={(v) => v.forma_transacao_id}
            getOptionLabel={(v) => `${v.parcela}x`}
            required
          />
        </div>
      {/if}
    </div>
    <!-- <div class="col-span-12">
      <SuperDebug data={pagamento} />
    </div> -->
  </section>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
