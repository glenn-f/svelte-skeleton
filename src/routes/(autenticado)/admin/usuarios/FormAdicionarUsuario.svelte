<script>
  import { invalidateAll } from '$app/navigation'
  import { PERM_APP } from '$lib/globals.js'
  import { modalStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  export let formData

  const { form, errors, enhance } = superForm(formData, {
    onResult: ({ result, cancel }) => {
      if (result.type == 'success') {
        cancel()
        invalidateAll()
        modalStore.close()
      }
    }
  })
</script>

<form class="card grid place-self-start w-modal p-2 pt-0 gap-2" action="?/addUser" method="POST" use:enhance>
  <div class="card-header">
    <h2 class="h2 text-center">Adicionar Usuário</h2>
  </div>
  <hr />
  <section class="grid grid-cols-12 gap-2 px-3 pb-2">
    <div class="col-span-12">
      <label class="label">
        <span>Nome</span>
        <input bind:value={$form.nome} name="nome" placeholder="Nome" type="text" class="input" class:input-error={$errors.nome} autocomplete="off" />
        {#if $errors.nome} <span class="text-error-400">{$errors.nome}</span> {/if}
      </label>
    </div>
    <div class="col-span-12">
      <input bind:value={$form.email} name="email" placeholder="E-mail" type="email" class="input" class:input-error={$errors.email} autocomplete="off" />
      {#if $errors.email} <span class="text-error-400">{$errors.email}</span> {/if}
    </div>
    <div class="col-span-6">
      <input bind:value={$form.senha} name="senha" placeholder="Senha" type="password" class="input" class:input-error={$errors.senha} autocomplete="off" />
      {#if $errors.senha} <span class="text-error-400">{$errors.senha}</span> {/if}
    </div>
    <div class="col-span-6">
      <input bind:value={$form.senha_repetir} name="senha_repetir" placeholder="Repetir Senha" type="password" class="input" class:input-error={$errors.senha_repetir} autocomplete="off" />
      {#if $errors.senha_repetir} <span class="text-error-400">{$errors.senha_repetir}</span> {/if}
    </div>
    <div class="col-span-12">
      <select bind:value={$form.permUsuario} name="permUsuario" class="select" class:input-error={$errors.permUsuario}>
        {#each Object.entries(PERM_APP) as [id, rotulo]}
          <option value={id}>{rotulo}</option>
        {/each}
      </select>
      {#if $errors.permUsuario} <span class="text-error-400">{$errors.permUsuario}</span> {/if}
    </div>
  </section>
  <div class="card-footer flex justify-center gap-2">
    <button type="submit" class="btn variant-filled-primary">Salvar</button>
    <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
  </div>
</form>
