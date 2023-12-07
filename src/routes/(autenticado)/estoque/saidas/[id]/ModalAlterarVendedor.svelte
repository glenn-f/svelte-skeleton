<script>
  import { goto } from '$app/navigation'
  import { triggerMessage } from '$lib/client'
  import CardModal from '$lib/components/CardModal.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  export let data
  const { formData, saida, colaboradores } = data
  const modalStore = getModalStore()
  const toastStore = getToastStore()
  const { form, errors, enhance, submitting } = superForm(formData, {
    dataType: 'json',
    taintedMessage: false,
    resetForm: true,
    onResult: async (event) => {
      triggerMessage(event, toastStore)
      if (event.result.type == 'success') {
        const id = event.result.data?.form?.data?.responsavel_id
        await goto(`/estoque/saidas/${saida.id}`, { invalidateAll: true })
        modalStore.close();
      }
    }
  })
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

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Trocar Vendedor</h2>
  </svelte:fragment>
  <form id="formAlterarVendedor" action="?/alterarVendedor" method="POST" class="grid grid-cols-12 gap-1 px-3" use:enhance>
    <div class="col-span-12">
      <InputSelect
        label="Vendedor"
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
  </form>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      <button type="submit" form="formAlterarVendedor" class="btn variant-filled-primary">Confirmar Alteração</button>
      <button type="button" class="btn variant-filled-tertiary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
