<script>
  import { invalidateAll } from '$app/navigation'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import InputEmail from '../../../../lib/components/Forms/InputEmail.svelte'
  import InputPassword from '../../../../lib/components/Forms/InputPassword.svelte'
  import InputSelect from './../../../../lib/components/Forms/InputSelect.svelte'
  import InputText from './../../../../lib/components/Forms/InputText.svelte'
  export let formData, permOptions

  const { form, errors, enhance, reset } = superForm(formData, {
    taintedMessage: false,
    onResult: async ({ result, cancel, formEl }) => {
      let { message } = result?.data?.form?.message ?? {}
      if (result.type == 'success') {
        cancel()
        formEl.reset()
        modalStore.close()
        formEl.reset()
        cancel()
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
      }
    }
  })
</script>

<form class="card w-modal p-2 pt-0 gap-2" action="?/addUser" method="POST" use:enhance>
  <div class="card-header">
    <h2 class="h2 text-center">Adicionar Usuário</h2>
  </div>
  <hr />
  <section class="grid grid-cols-12 gap-1 px-3 pb-2">
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
  <div class="card-footer flex justify-center gap-2">
    <button type="submit" class="btn variant-filled-primary">Salvar</button>
    <button
      type="button"
      class="btn variant-filled-secondary"
      on:click={(e) => {
        reset()
        modalStore.close()
      }}>Cancelar</button
    >
  </div>
</form>
