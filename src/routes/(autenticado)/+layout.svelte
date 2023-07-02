<script>
  import Icon from '@iconify/svelte'
  import { invalidateAll } from '$app/navigation'
  import { DevAccordion, Menu, MenuItem } from '$lib/components'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'

  export let data
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
  $: primeiroNome = data?.sessao?.nome?.split(' ')[0]
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar gridColumns="grid-cols-3" padding="p-1" slotDefault="place-self-center" slotTrail="place-content-end" background="bg-surface-300 dark:bg-surface-800 shadow-lg">
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
        {#if data?.sessao?.empresa_nome_fantasia}
           <a href class="btn btn-sm variant-soft-surface hover:variant-soft-primary grid place-items-center">
             <h5 class="h5 text-center flex gap-1 items-center">
               <Icon icon="fa6-solid:shop" />
               {data.sessao.empresa_nome_fantasia}
             </h5>
             <!-- <div class="flex items-center gap-1 italic text-xs text-secondary-500-400-token">
               <Icon icon="fa6-solid:rotate" />
               <span>Trocar Empresa</span>
             </div> -->
           </a>
        {/if}
        <a href="/perfil" class="btn btn-sm variant-soft-surface hover:variant-soft-primary">
          <div class="flex flex-col">
            <div class="flex justify-center font-bold gap-1">
              <Icon icon="fa6-solid:circle-user" width="20px" height="20px" />
              Minha Conta
            </div>
            <span class="italic text-xs text-secondary-500-400-token">
              {#if primeiroNome}{primeiroNome}{/if}
            </span>
          </div>
        </a>
        <a href="/logout" class="btn btn-sm variant-soft-surface hover:variant-soft-primary">
          <div class="flex flex-col">
            <div class="flex justify-center font-bold gap-1">
              <Icon icon="mdi:logout" width="20px" height="20px" />
              Sair
            </div>
          </div>
        </a>
        <LightSwitch rounded="rounded-full" />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <main class="p-2 h-full overflow-x-auto bg-surface-50-900-token">
    <slot />
  </main>

  <svelte:fragment slot="pageFooter">
    <DevAccordion />
  </svelte:fragment>
</AppShell>
