<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { FCC_RECEITA, mapSaidaFC } from '$lib/globals'
  import { criarContabilSchema } from '$lib/zod/schemas/contabil'
  import { modalStore } from '@skeletonlabs/skeleton'
  /** @type {import('svelte/store').Writable} */
  export let store
  let form = {}
  let errors = {}
  let globalError = ''
  let lancamento = undefined

  function handleAdicionar() {
    const validation = criarContabilSchema.safeParse(form)
    if (validation.success) {
      const { observacoes, valor } = validation.data
      const dados = {
        observacoes,
        valor: valor * lancamento.multiplicador,
        tipo_fc: lancamento.tipo_fc
      }
      $store.contabil = [...($store.contabil ?? []), dados]
      modalStore.close()
    } else {
      const { fieldErrors, formErrors } = validation.error?.flatten() || {}
      errors = { ...fieldErrors }
      globalError = formErrors
    }
  }
  let labelValor
  $: if (lancamento === undefined) {
    form.tipo_fc = undefined
    errors = {}
    globalError = ''
  } else {
    labelValor = lancamento.classe === FCC_RECEITA ? (lancamento.multiplicador == 1 ? 'Valor do Acréscimo' : 'Valor do Desconto') : 'Valor do Custo Interno'
    form.tipo_fc = lancamento.tipo_fc
  }
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar Lançamento</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-3 px-3">
    {#if !lancamento}
      <!-- ! Receitas -->
      <div class="col-span-12">
        <h5 class="h5 inline">Acréscimos e Serviços</h5>
         - Aumentam o valor final
      </div>
      <div class="col-span-12 flex flex-wrap gap-1">
        {#each mapSaidaFC.receitas as r, i}
          <Button text={r.nome} class="btn-sm variant-filled-success" on:click={() => (lancamento = r)} />
        {/each}
      </div>
      <!-- ! Descontos -->
      <div class="col-span-12">
        <h5 class="h5 inline">Descontos sobre a Venda</h5>
         - Diminuem o valor final
      </div>
      <div class="col-span-12 flex flex-wrap gap-1">
        {#each mapSaidaFC.descontos as d, i}
          <Button text={d.nome} class="btn-sm variant-soft-error" on:click={() => (lancamento = d)} />
        {/each}
      </div>
      <!-- ! Custos Internos -->
      <div class="col-span-12">
        <h5 class="h5 inline">Custos Internos</h5>
         - Não alteram o valor final
      </div>
      <div class="col-span-12 flex flex-wrap gap-1 mb-2">
        {#each mapSaidaFC.custos as c, i}
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
      <div class="col-span-12">
        <InputMoeda label={labelValor} bind:value={form.valor} error={errors.valor} required />
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
