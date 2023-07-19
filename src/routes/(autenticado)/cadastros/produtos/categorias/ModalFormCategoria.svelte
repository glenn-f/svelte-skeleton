<script>
	import { invalidateAll } from '$app/navigation'
	import CardModal from '$lib/components/CardModal.svelte'
	import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
	import InputText from '$lib/components/Forms/InputText.svelte'
	import { modalStore, toastStore } from '@skeletonlabs/skeleton'
	import { superForm } from 'sveltekit-superforms/client'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = { nome: '' }
  formData.data = { ...initialData }
  formData.errors = {}
  const { form, errors, enhance, reset, message } = superForm(formData, {
    resetForm: true,
    taintedMessage: false,
    onResult: async ({ result, cancel, formEl }) => {
      const message = result.data?.form?.message
      if (result.type == 'success') {
        cancel()
        formEl.reset()
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        modalStore.close()
        invalidateAll()
      }
    }
  })

  let action, titulo, pw_placeholder
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
    pw_placeholder = 'Não alterado'
  } else if (modo == 'apagar') {
    action = '?/apagar'
    titulo = 'Apagar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
    pw_placeholder = ''
  }

  function onClose() {
    reset()
    modalStore.close()
  }
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Categoria</h2>
    </svelte:fragment>
    <!-- <SuperDebug data={$form} /> -->
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-12">
        <InputText label="Nome" placeholder="Ex: Telefonia, Informática, Escritório etc" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={formData.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={onClose}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
