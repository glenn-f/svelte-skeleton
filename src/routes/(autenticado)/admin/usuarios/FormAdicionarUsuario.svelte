<script>
  import { PERM_APP } from '$lib/globals.js'
  import { modalStore } from '@skeletonlabs/skeleton'
</script>

<form class="card grid place-self-start w-modal p-2 pt-0 gap-2" action="?/addUser" method="POST">
  <div class="card-header">
    <h2 class="h2 text-center">Adicionar Usuário</h2>
  </div>
  <hr />
  <section class="grid grid-cols-12 gap-2 px-3 pb-2">
    <div class="col-span-12">
      <input type="text" name="nome" class="input" placeholder="Nome" autocomplete="off" />
    </div>
    <div class="col-span-12">
      <input type="email" name="e_email" class="input" placeholder="E-mail" autocomplete="off" />
    </div>
    <div class="col-span-6">
      <input type="password" name="e_senha" class="input" placeholder="Senha" autocomplete="off" />
    </div>
    <div class="col-span-6">
      <input type="password" name="senha_repetir" class="input" placeholder="Repetir Senha" autocomplete="off" />
    </div>
    <div class="col-span-12">
      <select name="permUsuario" class="select">
        {#each Object.entries(PERM_APP) as [id, rotulo]}
          <option value={id}>{rotulo}</option>
        {/each}
      </select>
    </div>
  </section>
  <div class="card-footer flex justify-center gap-2">
    <button type="submit" class="btn variant-filled-primary">Salvar</button>
    <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
  </div>
</form>
