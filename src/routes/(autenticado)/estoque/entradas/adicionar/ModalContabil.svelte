<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { mapEntradaFC } from '$lib/globals'
  import { criarContabilSchema } from '$lib/zod/schemas/contabil'
  import { getModalStore } from '@skeletonlabs/skeleton'
  const modalStore = getModalStore()
  /** @type {import('svelte/store').Writable} */
  export let store
  let form = {}
  let errors = {}
  let globalError = ''
  let lancamento = undefined

  function handleAdicionar() {
    if (!lancamento) return
    const validation = criarContabilSchema.safeParse(form)
    if (!validation.success) {
      const { fieldErrors, formErrors } = validation.error?.flatten() || {}
      errors = { ...fieldErrors }
      globalError = formErrors
      return
    }
    validation.data.valor *= lancamento.multiplicador
    $store.contabil = [...($store.contabil ?? []), validation.data]
    modalStore.close()
  }
  let labelValor
  $: if (lancamento === undefined) {
    form.tipo_fc = undefined
    errors = {}
    globalError = ''
  } else {
    form.tipo_fc = lancamento.tipo_fc
  }
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Lançamento</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    {#if !lancamento}
      <!-- ! Receitas -->
      <div class="col-span-12">
        <h5 class="h5 inline">Custos adicionais</h5>
        - Aumentam o valor do estoque
      </div>
      <div class="col-span-12 flex flex-wrap gap-1">
        {#each mapEntradaFC.custos as c, i}
          <Button text={c.nome} class="btn-sm variant-filled-secondary" on:click={() => (lancamento = c)} />
        {/each}
      </div>
      <!-- ! Descontos -->
      <div class="col-span-12">
        <h5 class="h5 inline">Créditos Derivados da Compra</h5>
        - Diminuem o valor do estoque
      </div>
      <div class="col-span-12 flex flex-wrap gap-1">
        {#each mapEntradaFC.creditos as c, i}
          <Button text={c.nome} class="btn-sm variant-soft-tertiary" on:click={() => (lancamento = c)} />
        {/each}
      </div>
    {:else}
      <!-- * Dados do Lançamento -->
      <div class="col-span-9 grid">
        <ShowBox label="Lançamento Selecionado" boxClass="!variant-soft-warning">{lancamento.nome}</ShowBox>
      </div>
      <div class="col-span-3 self-end">
        <Button text="Resetar" class="variant-filled-warning" on:click={() => (lancamento = undefined)} />
      </div>
      <div class="col-span-12">
        <p><b>Descrição:</b> {lancamento.desc}</p>
      </div>
      {@const label = lancamento.multiplicador == -1 ? 'Valor do Custo' : 'Valor do Crédito'}
      <div class="col-span-12">
        <InputMoeda {label} bind:value={form.valor} error={errors.valor} required />
      </div>
      <div class="col-span-12">
        <InputText label="Observações" bind:value={form.observacoes} error={errors.observacoes} />
      </div>
    {/if}
    <!-- * Debugger -->
    <!-- <div class="col-span-12">
      <SuperDebug data={{ form, lancamento }} />
    </div> -->
  </section>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      {#if lancamento}
        <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      {/if}
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
