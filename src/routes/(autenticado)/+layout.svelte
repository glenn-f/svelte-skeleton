<script>
  import { invalidateAll } from '$app/navigation'
  import DevAccordion from '$lib/components/DevAccordion.svelte'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import NavItems from './NavItems.svelte'
  export let data
  let primeiroNome = data?.sessao?.nome?.split(' ')[0]
  onMount(() => {
    const tempoAtualizar = 5 * 60 * 1000
    const tempoSessao = Math.max((data?.sessao?.expiracao ?? 0) - Date.now(), 5000)
    const atualizar = setInterval(invalidateAll, tempoAtualizar)
    const verificarSessao = setInterval(invalidateAll, tempoSessao)
    return () => {
      clearInterval(atualizar)
      clearInterval(verificarSessao)
    }
  })
</script>

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
