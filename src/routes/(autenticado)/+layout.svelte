<script>
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
  import { Accordion, AccordionItem, AppBar, AppShell } from '@skeletonlabs/skeleton'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  page
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

  <svelte:fragment slot="pageFooter">
    {#if dev}
      <div class="bg-orange-300">
        <Accordion>
          <AccordionItem>
            <svelte:fragment slot="lead">➡️</svelte:fragment>
            <svelte:fragment slot="summary">SuperDebug</svelte:fragment>
            <svelte:fragment slot="content">
              <SuperDebug data={$page} label="/(autenticado)/* - layout.svelte - SuperDebug" />
            </svelte:fragment>
          </AccordionItem>
        </Accordion>
      </div>
    {/if}
  </svelte:fragment>
</AppShell>
