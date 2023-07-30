<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  export let form
  let taxa_encargo, parcela

  function adicionar() {
    $form.parcelamentos.push({ taxa_encargo, parcela })
    modalStore.close()
  }
</script>

<form>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">Adicionar Parcelamento</h2>
    </svelte:fragment>
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-6">
        <InputNumber label="Parcela" bind:value={parcela} required />
      </div>
      <div class="col-span-6">
        <InputPercent label="Taxa de Encargo" bind:value={taxa_encargo} required />
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      <div class="flex gap-2">
        <button type="submit" class="btn variant-filled-primary" on:click|preventDefault={adicionar}>Adicionar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
