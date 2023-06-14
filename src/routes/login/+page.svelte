<script>
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data
  const { form, errors, constraints, enhance } = superForm(data.form)
</script>

<SuperDebug data={$form} />

<div class="grid place-items-center my-3">
  <form method="post" class="card w-[300px] p-4 grid place-items-center gap-3" action="?/login" use:enhance>
    <h3 class="h3">Autenticar</h3>
		<div class="container">
			<input class="input" class:input-error={$errors.email} type="text" placeholder="E-mail" name="email" bind:value={$form.email} />
			{#if $errors.email} <span class="text-error-400">{$errors.email}</span> {/if}
		</div>
		<div class="container">
			<input class="input" class:input-error={$errors.senha} type="password" placeholder="Senha" name="senha" bind:value={$form.senha} />
			{#if $errors.senha} <span class="text-error-400">{$errors.senha}</span> {/if}
		</div>
    <button class="btn variant-filled-primary" type="submit">Entrar</button>
  </form>
</div>
