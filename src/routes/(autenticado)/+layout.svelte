<script>
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/stores'
  import { DevAccordion, Menu, MenuItem } from '$lib/components'
  import { USUARIO_ADMINISTRADOR, USUARIO_MEMBRO } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  export let data
  onMount(() => {
    const tempoSessao = Math.max((data?.sessao?.expiracao ?? 0) - Date.now(), 5000)
    const verificarSessao = setInterval(invalidateAll, tempoSessao)
    return () => {
      clearInterval(verificarSessao)
    }
  })
  $: primeiroNome = data?.sessao?.nome?.split(' ')[0]
  $: adm = data.sessao?.perm == USUARIO_ADMINISTRADOR
  $: membro = data.sessao?.perm == USUARIO_MEMBRO
  $: podeCriarEmpresa = adm || membro
  $: haEmpresa = !!data?.sessao?.empresa
  $: donoEmpresa = haEmpresa && data?.sessao?.empresa?.dono_id === data?.sessao.uid
  $: verMenus = adm || donoEmpresa
  $: gpe = data.sessao?.gpe || {}
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar gridColumns="grid-cols-3" padding="p-1" slotDefault="place-self-center" slotTrail="place-content-end" background="bg-surface-300 dark:bg-surface-800 shadow-lg">
      <svelte:fragment slot="lead">
        {#if data?.sessao?.empresa?.nome_fantasia}
          <a href="/inicio" class="grid place-items-center hover:bg-surface-600 bg-surface-900 rounded-lg transition-all">
            <div>
              <img class="h-14 rounded-lg" src="/brand.png" alt="" />
            </div>
            <!-- <Icon icon="fa6-solid:building" />
              {data.sessao.empresa.nome_fantasia} -->
            <!-- <div class="flex items-center gap-1 italic text-xs text-secondary-500-400-token">
               <Icon icon="fa6-solid:rotate" />
               <span>Trocar Empresa</span>
             </div> -->
          </a>
        {/if}
      </svelte:fragment>
      <div class="flex flex-row gap-1">
        {#if adm}
          <Menu titulo="Administração" icon="fa6-solid:crown">
            <MenuItem href="/admin/usuarios" titulo="Usuários" icon="fa-solid:user-cog" />
            <MenuItem href="/admin/componentes" titulo="Componentes" />
          </Menu>
        {/if}
        {#if haEmpresa}
          {#if verMenus || gpe.menu_loja}
            <Menu titulo="Loja" icon="fa6-solid:store" width="w-64">
              {#if verMenus || gpe.pode_iniciar_venda}
                <MenuItem href="/loja/vender" titulo="Iniciar Venda" icon="mdi:point-of-sale" />
              {/if}
              {#if verMenus || gpe.pode_ver_estoque_disponivel}
                <MenuItem href="/loja/disponivel" titulo="Estoque Disponível" icon="mdi:cart-check" />
              {/if}
              {#if verMenus || gpe.pode_ver_historico_vendas}
                <MenuItem href="/loja/historico" titulo="Histórico de Vendas" icon="mdi:receipt-text-clock" />
              {/if}
            </Menu>
          {/if}
          {#if verMenus || gpe.menu_estoque}
            <Menu titulo="Estoque" icon="mdi:warehouse">
              {#if verMenus || gpe.pode_ver_estoque}
                <MenuItem href="/estoque/inventario" titulo="Inventário" icon="fluent-mdl2:product-list" />
              {/if}
              {#if verMenus || gpe.pode_entrada_estoque}
                <MenuItem href="/estoque/entradas" titulo="Entradas" icon="ri:inbox-archive-fill" />
              {/if}
              {#if verMenus || gpe.pode_saida_estoque}
                <MenuItem href="/estoque/saidas" titulo="Saídas" icon="ri:inbox-unarchive-fill" />
              {/if}
            </Menu>
          {/if}
          {#if verMenus || gpe.menu_transacoes}
            <Menu titulo="Transações" icon="ic:round-currency-exchange">
              {#if verMenus || gpe.pode_ver_saldo}
                <MenuItem href="/transacoes/saldo" titulo="Saldo de Contas" icon="fa6-solid:coins" />
              {/if}
              {#if verMenus || gpe.pode_transacao_despesa}
                <MenuItem href="/transacoes/historico" titulo="Histórico" icon="mdi:cash-sync" />
              {/if}
            </Menu>
          {/if}
          {#if verMenus || gpe.menu_cadastros}
            <Menu titulo="Cadatros" icon="fa6-solid:book">
              {#if verMenus || gpe.pode_cadastrar_usuario}
                <MenuItem href="/cadastros/usuarios" titulo="Usuários" icon="mdi:user-key" />
              {/if}
              {#if verMenus || gpe.pode_cadastrar_conta}
                <MenuItem href="/cadastros/contas" titulo="Contas" icon="guidance:bank" />
              {/if}
              {#if verMenus || gpe.pode_cadastrar_produto}
                <MenuItem href="/cadastros/produtos" titulo="Produtos" icon="fluent-mdl2:product-variant" />
              {/if}
              {#if verMenus || gpe.pode_cadastrar_pessoa}
                <MenuItem href="/cadastros/pessoas" titulo="Pessoas" icon="mdi:account-group" />
              {/if}
              {#if verMenus || gpe.pode_cadastrar_conta}
                <MenuItem href="/cadastros/tributos" titulo="Tributos" icon="heroicons-solid:receipt-tax" />
              {/if}
              {#if verMenus || gpe.pode_cadastrar_conta}
                <MenuItem href="/cadastros/comissao" titulo="Comissão" icon="heroicons-outline:receipt-tax" />
              {/if}
            </Menu>
          {/if}
        {:else if podeCriarEmpresa}
          <Menu href="/perfil/empresas" titulo="Cadastre a sua empresa para ver as opções" icon="mdi:registered-trademark" />
        {/if}
      </div>
      <svelte:fragment slot="trail">
        <div class="flex flex-col items-center">
          <div class="flex flex-nowrap gap-2">
            <a href="/perfil" class="btn btn-sm variant-soft-surface hover:variant-soft-primary">
              <div class="flex flex-col">
                <div class="flex justify-center gap-1">
                  <Icon icon="fa6-solid:circle-user" width="20px" height="20px" />
                  Minha Conta
                </div>
              </div>
            </a>
            <a href="/logout" class="btn btn-sm variant-soft-surface hover:variant-soft-primary">
              <div class="flex flex-col">
                <div class="flex justify-center gap-1">
                  <Icon icon="mdi:logout" width="20px" height="20px" />
                  Sair
                </div>
              </div>
            </a>
          </div>
          <div class="italic text-primary-700-200-token text-xs text-ellipsis whitespace-nowrap flex flex-nowrap items-center gap-1">
            {#if adm}
              <Icon icon="fa6-solid:crown" />
            {/if}
            <span>
              {#if primeiroNome}Olá, {primeiroNome}{/if} ({data.sessao?.email})
            </span>
          </div>
        </div>
        <div>
          <LightSwitch rounded="rounded-full" />
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  {#key $page.route.id}
    <main class="p-2 h-full overflow-x-auto bg-surface-50-900-token" in:fade={{ duration: 150 }}>
      <slot />
    </main>
  {/key}

  <svelte:fragment slot="pageFooter">
    <DevAccordion />
  </svelte:fragment>
</AppShell>
