<script>
  import { AppBar, AppShell } from '@skeletonlabs/skeleton'

  export let data
  let primeiroNome = data?.sessao?.nome?.split(' ')[0]
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar background="bg-slate-400">
      <svelte:fragment slot="lead">
        <h4 class="h4 uppercase">Gestor Loja</h4>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <a href="/logout" class="btn variant-filled"
          >Sair {#if primeiroNome} ({primeiroNome}) {/if}</a
        >
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <main class="p-2">
    <slot />
  </main>
</AppShell>
