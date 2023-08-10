<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { FCC_CUSTO, FCC_RECEITA, TIPOS_CUSTO, TIPOS_RECEITA, mapFluxoContabilClasse } from '$lib/globals'
  import { addLancamentoEntradaSchema } from '$lib/zod/schemas/contabil'
  import { modalStore } from '@skeletonlabs/skeleton'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  /** @type {import('svelte/store').Writable} */
  export let store
  export let classe = FCC_CUSTO
  let contabil = {},
    errors = {}

  function handleAdicionar() {
    const validation = addLancamentoEntradaSchema.safeParse(contabil)
    if (validation.success) {
      $store.contabil = [...($store.contabil ?? []), validation.data]
      modalStore.close()
    } else {
      errors = { ...validation.error?.flatten()?.fieldErrors }
    }
  }

  $: tipos = classe == FCC_RECEITA ? TIPOS_RECEITA : TIPOS_CUSTO
  $: classe_titulo = mapFluxoContabilClasse.get(classe)
  $: contabil.classe_fc = classe
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Adicionar {classe_titulo}</h2>
  </svelte:fragment>
  <section class="grid grid-cols-12 gap-1 px-3">
    <div class="col-span-12 grid grid-cols-12 gap-2">
      <div class="col-span-3">
        <InputText label="Classe Contábil" readonly value={classe_titulo} />
      </div>
      <div class="col-span-5">
        <InputSelect label="Tipo Contábil" bind:value={contabil.tipo_fc} options={tipos} error={errors.tipo_fc} required />
      </div>
      <div class="col-span-4">
        <InputMoeda label="Valor" bind:value={contabil.valor} error={errors.valor} required />
      </div>
      <div class="col-span-12">
        <InputText label="Observações" bind:value={contabil.observacoes} error={errors.observacoes} />
      </div>
    </div>
    <!-- <div class="col-span-12">
      <SuperDebug data={contabil} />
    </div> -->
  </section>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      <button type="button" class="btn variant-filled-primary" on:click={handleAdicionar}>Adicionar</button>
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
