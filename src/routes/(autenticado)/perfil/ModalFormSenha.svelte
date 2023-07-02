<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import HelperMessage from '../../../lib/components/Forms/HelperMessage.svelte'
  import InputPassword from '../../../lib/components/Forms/InputPassword.svelte'

  /** Dados do formulário de alterar senha como SuperForm
   * @type {import("sveltekit-superforms/client").SuperForm<any>}
   */
  export let superForm

  const { errors, form, message, reset, enhance } = superForm

  function onClose() {
    reset()
    modalStore.close()
  }
</script>

<form action="?/alterarSenha" method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">Alterar Senha</h2>
    </svelte:fragment>

    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-6">
        <InputPassword label="Senha" name="senha" bind:value={$form.senha} error={$errors.senha} errorSpacing required />
      </div>
      <div class="col-span-6">
        <InputPassword label="Repetir Senha" name="senha_repetir" bind:value={$form.senha_repetir} error={$errors.senha_repetir} errorSpacing required />
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        <button type="submit" class="btn variant-filled-primary">Confirmar</button>
        <button type="reset" class="btn variant-filled-secondary" on:click={onClose}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
