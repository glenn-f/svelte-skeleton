<script>
  import { invalidateAll } from '$app/navigation'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputPassword from '$lib/components/Forms/InputPassword.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import CardModal from '$lib/components/CardModal.svelte'
  export let formData, permOptions
  /** @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'

  const { form, errors, enhance } = superForm(formData, {
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
  } else if (modo == 'apagar') {
    action = '?/apagar'
    titulo = 'Apagar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
  }
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Usuário</h2>
    </svelte:fragment>

    {#if modo != 'apagar'}
      <section class="grid grid-cols-12 gap-1 px-3">
        <div class="col-span-12">
          <InputText label="Nome Completo" placeholder="Ex: Enzo Gabriel" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
        </div>
        <div class="col-span-12">
          <InputEmail label="E-mail" placeholder="Ex: enzo.gabriel@email.com" name="email" bind:value={$form.email} error={$errors.email} errorSpacing required />
        </div>
        <div class="col-span-6">
          <InputPassword label="Senha" name="senha" bind:value={$form.senha} error={$errors.senha} errorSpacing required />
        </div>
        <div class="col-span-6">
          <InputPassword label="Repetir Senha" name="senha_repetir" bind:value={$form.senha_repetir} error={$errors.senha_repetir} errorSpacing required />
        </div>
        <div class="col-span-12">
          <InputSelect label="Permissão na Aplicação" name="permUsuario" bind:value={$form.permUsuario} options={permOptions} error={$errors.permUsuario} errorSpacing required />
        </div>
      </section>
    {:else}
      <section class="grid place-items-center p-2">Tem certeza que deseja apagar o seguinte usuário: ....</section>
    {/if}

    <svelte:fragment slot="footer">
      {#if modo != 'apagar'}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
      {:else}
        <button type="submit" class="btn variant-filled-error">Confirmar</button>
      {/if}
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </svelte:fragment>
  </CardModal>
</form>
