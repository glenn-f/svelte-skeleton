<script>
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputPassword from '$lib/components/Forms/InputPassword.svelte'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import DevAccordion from '$lib/components/DevAccordion.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  export let data

  const { form, errors, enhance, message } = superForm(data.form, { taintedMessage: false })
</script>

<div class="grid pt-5 gap-2">
  <div class="grid place-items-center mt-5">
    <form action="?/login" method="post" class="card w-80 p-4 grid grid-cols-2 place-items-center gap-3 hover:shadow-primary-500 hover:shadow-md transition-all" use:enhance>
      <h3 class="h3 col-span-2">Autenticação</h3>
      <div class="col-span-2 w-full">
        <InputEmail label="E-mail" name="email" placeholder="exemplo@email.com" error={$errors.email} bind:value={$form.email} required errorSpacing />
      </div>
      <div class="col-span-2 w-full">
        <InputPassword label="Senha" name="senha" error={$errors.senha} bind:value={$form.senha} required errorSpacing />
      </div>
      <div class="col-span-2 w-full grid place-items-center">
        <button class="btn variant-filled-primary" type="submit">Entrar</button>
        <HelperMessage error={$message} />
      </div>
    </form>
  </div>

  <div class="grid place-items-center">
    <DevAccordion />
  </div>
</div>
