<script>
  import Icon from '@iconify/svelte'
  import { invalidateAll } from '$app/navigation'
  import { DevAccordion, Menu, MenuItem } from '$lib/components'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'

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
    <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end" background="bg-primary-500">
      <svelte:fragment slot="lead">
        <a href="/inicio" class="anchor no-underline">
          <h5 class="h5 uppercase text-bold text-surface-700-200-token">📊App Name</h5>
        </a>
      </svelte:fragment>
      <div class="flex flex-row gap-1">
        <Menu titulo="Administração" icon="fa6-solid:gears">
          <MenuItem href="/admin/usuarios" titulo="Usuários" icon="fa-solid:user-cog" />
        </Menu>

        <Menu titulo="Cadatros" icon="mdi:book-cog">
          <MenuItem href="/produtos" titulo="Produtos" icon="fluent-mdl2:product-list" />
          <MenuItem href="/pessoas" titulo="Pessoas" icon="ph:user-list" />
        </Menu>

        <Menu titulo="Testes" icon="mdi:test-tube">
          <MenuItem href="/componentes" titulo="Componentes" />
        </Menu>
      </div>
      <svelte:fragment slot="trail">
        <a href="/logout" class="btn variant-filled">
          <Icon icon="mdi:logout" width="20px" height="20px" />
          Sair {#if primeiroNome}({primeiroNome}){/if}</a
        >
        <LightSwitch rounded="rounded-full" />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <main class="p-2 overflow-x-auto">
    <slot />
  </main>

  <svelte:fragment slot="pageFooter">
    <DevAccordion />
  </svelte:fragment>
</AppShell>
