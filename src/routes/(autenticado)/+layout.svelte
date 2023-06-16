<script>
  import NavItems from './NavItems.svelte'
  import { autoModeWatcher } from '@skeletonlabs/skeleton'
  import DevAccordion from '$lib/components/DevAccordion.svelte'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  export let data
  let primeiroNome = data?.sessao?.nome?.split(' ')[0]
</script>

<svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end" background="bg-primary-300-600-token">
      <svelte:fragment slot="lead">
        <a href="/inicio" class="anchor no-underline">
          <h5 class="h5 uppercase text-primary-50-900-token">📊[Nome da Aplicação]</h5>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="default">
        <NavItems />
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <a href="/logout" class="btn variant-filled"
          >Sair {#if primeiroNome} ({primeiroNome}) {/if}</a
        >
        <LightSwitch rounded="rounded-full" />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <main class="p-2">
    <slot />
  </main>

  <svelte:fragment slot="pageFooter">
    <DevAccordion />
  </svelte:fragment>
</AppShell>
