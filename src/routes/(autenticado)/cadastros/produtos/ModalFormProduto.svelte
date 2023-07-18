<script>
	import  InputSelect  from '$lib/components/Forms/InputSelect.svelte';
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { RadioGroup, RadioItem, modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import HelperMessage from '../../../../lib/components/Forms/HelperMessage.svelte'
  import InputDate from '../../../../lib/components/Forms/InputDateTime.svelte'
  import InputMask from '../../../../lib/components/Forms/InputMask.svelte'
  import Label from '../../../../lib/components/Forms/Label.svelte'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'
  export let categorias
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Lista de opções de permissões que um usuário pode ter
   * @type {Map<number, {label: string}>} */
  export let permOptions
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
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
      <h2 class="h2">{titulo} Produto</h2>
    </svelte:fragment>
    <!-- <SuperDebug data={$form} /> -->
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="class col-span-12">
        <InputSelect name='produto_categoria_id' label="Categoria" options={categorias} bind:value={$form.produto_categoria_id}  ></InputSelect>
      </div>
      <div class="col-span-12">
        <InputText label="Nome" placeholder="Ex: Iphone 20 Ultra Pro 1TB" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <div class="col-span-12">
        <InputText label="Tipo de Identificação Única" placeholder="Ex: IMEI, Serial Number" name="titulo_codigo" bind:value={$form.titulo_codigo} error={$errors.titulo_codigo} errorSpacing required />
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
