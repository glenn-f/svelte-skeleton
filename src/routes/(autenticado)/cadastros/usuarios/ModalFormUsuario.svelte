<script>
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import HelperMessage from './../../../../lib/components/Forms/HelperMessage.svelte'
  import { invalidateAll } from '$app/navigation'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputPassword from '$lib/components/Forms/InputPassword.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import CardModal from '$lib/components/CardModal.svelte'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Lista de opções de permissões que um usuário pode ter
   * @type {Map<number, {label: string}>} */
  export let permOptions
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = { senha: '', senha_repetir: '', nome: '', email: '', tipo_usuario: 0 }

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
    modalStore.close()
  }
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Usuário</h2>
    </svelte:fragment>

    {#if modo != 'apagar'}
      <section class="grid grid-cols-12 gap-1 px-3">
        {#if initialData.tipo_usuario == 0}
          <div class="col-span-12">
            <InputText label="Nome Completo" placeholder="Ex: Enzo Gabriel" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
          </div>
          <div class="col-span-12">
            <InputEmail label="E-mail" placeholder="Ex: enzo.gabriel@email.com" name="email" bind:value={$form.email} error={$errors.email} errorSpacing required />
          </div>
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

        <div class="col-span-12">
          <InputSelect
            label="Grupo de Permissão"
            name="gpe_id"
            bind:value={$form.gpe_id}
            options={permOptions}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.nome}
            error={$errors.gpe_id}
            errorSpacing
            required
          />
        </div>
      </section>
    {:else}
      <section class="grid place-items-center p-2 gap-2">
        Tem certeza que deseja apagar o seguinte usuário: <br />
        <h4 class=" h4 text-red-500 font-bold">
          {initialData.nome}
        </h4>
        <p>E-mail: <b>{initialData.email}</b></p>
      </section>
    {/if}

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={initialData.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={onClose}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
