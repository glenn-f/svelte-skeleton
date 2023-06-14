<script>
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data
  const { form, errors, constraints } = superForm(data.form)
</script>

<SuperDebug data={$form} />

<div class="grid place-items-center my-3">
  <form method="post" class="card w-[300px] p-4 grid place-items-center gap-3">
    <h3 class="h3">Autenticar</h3>
    <input class="input" type="text" placeholder="E-mail" name="email" bind:value={$form.email} required />
    <input class="input" type="password" placeholder="Senha" name="senha" bind:value={$form.senha} required />
    <button class="btn variant-filled-primary" type="submit" formaction="?/login">Entrar</button>
  </form>
</div>
