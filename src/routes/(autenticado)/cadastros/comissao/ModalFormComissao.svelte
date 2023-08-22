<script>
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData

  const { form, errors, enhance, message } = superForm(formData, {
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

  let action, titulo
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
  }

  onMount(() => {
    $form = { ...initialData }
    $errors = {}
    $message = ''
  })
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Regra de Comissão</h2>
    </svelte:fragment>
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-6">
        <InputText label="Nome da Regra de Comissão" placeholder="Ex: Apple 1%, Vendedor A" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <div class="col-span-3">
        <InputPercent casasDecimais={2} error={$errors.taxa_fixa} name="taxa_fixa" label="Taxa da Comissão" bind:value={$form.taxa_fixa} required />
      </div>
      <div class="col-span-3">
        <InputMoeda error={$errors.bonus_fixo} name="bonus_fixo" label="Bônus Fixo" bind:value={$form.bonus_fixo} required />
      </div>
      <div class="col-span-12">
        <InputText label="Descrição" placeholder="Dê detalhes sobre esta regra" name="descricao" bind:value={$form.descricao} error={$errors.descricao} errorSpacing required />
      </div>
      <!-- <div class="col-span-12">
        <SuperDebug data={{ $form }} />
      </div> -->
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={initialData?.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
