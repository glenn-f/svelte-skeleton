<script>
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputPassword from '$lib/components/Forms/InputPassword.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { USUARIO_ADICIONAL } from '$lib/globals'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import { onMount } from 'svelte'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Lista de opções de permissões que um usuário pode ter
   * @type {Map<number, string}>} */
  export let permOptions
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = { senha: '', senha_repetir: '', nome: '', email: '', gpe_id: permOptions[0]?.id }

  const { form, errors, enhance, message } = superForm(formData, {
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
  } else if (modo == 'senha') {
    action = '?/alterarSenha'
    titulo = 'Alterar Senha do'
    pw_placeholder = 'Não alterado'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
    pw_placeholder = ''
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
      <h2 class="h2">{titulo} Usuário</h2>
    </svelte:fragment>

    <section class="grid grid-cols-12 gap-1 px-3">
      {#if modo == 'adicionar' || (modo == 'editar' && initialData.tipo_usuario === USUARIO_ADICIONAL)}
        <div class="col-span-12">
          <InputText label="Nome Completo" placeholder="Ex: Enzo Gabriel" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
        </div>
        <div class="col-span-12">
          <InputEmail label="E-mail" placeholder="Ex: enzo.gabriel@email.com" name="email" bind:value={$form.email} error={$errors.email} errorSpacing required />
        </div>
      {/if}
      {#if modo == 'senha'}
      <div class="col-span-6">
        <InputText label="Nome Completo" value={initialData.nome} readonly />
      </div>
      <div class="col-span-6">
        <InputText label="E-mail" value={initialData.email} readonly />
      </div>
      {/if}
      {#if modo == 'adicionar' || modo == 'senha'}
        <div class="col-span-6">
          <InputPassword label="Senha" placeholder={pw_placeholder} name="senha" bind:value={$form.senha} error={$errors.senha} errorSpacing required={modo == 'adicionar'} />
        </div>
        <div class="col-span-6">
          <InputPassword
            label="Repetir Senha"
            placeholder={pw_placeholder}
            name="senha_repetir"
            bind:value={$form.senha_repetir}
            error={$errors.senha_repetir}
            errorSpacing
            required={modo == 'adicionar'}
          />
        </div>
      {/if}
      {#if modo != 'senha'}
        <div class="col-span-12">
          <InputSelect
            label="Grupo de Usuário"
            name="gpe_id"
            bind:value={$form.gpe_id}
            options={permOptions}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.nome}
            getDisabled={(option) => Boolean(option.delecao)}
            error={$errors.gpe_id}
            errorSpacing
            required
          />
        </div>
      {/if}
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar' || modo == 'senha'}
          <input type="hidden" name="id" value={initialData.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
