<script>
  import Icon from '@iconify/svelte'
  import { invalidateAll } from '$app/navigation'
  import { DevAccordion, Menu, MenuItem } from '$lib/components'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { PERM_APP_MASTER } from '$lib/globals'

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
        {#if data.sessao?.perm == PERM_APP_MASTER}
          <Menu titulo="Administração" icon="fa6-solid:crown">
            <MenuItem href="/admin/usuarios" titulo="Usuários" icon="fa-solid:user-cog" />
            <MenuItem href="/admin/componentes" titulo="Componentes" />
          </Menu>
        {/if}
        {#if data?.sessao?.gpe || data?.sessao?.empresa?.dono_id === data?.sessao.uid}
          {#if data.sessao.gpe.pode_iniciar_venda || data.sessao.gpe.pode_ver_estoque_disponivel || data.sessao.gpe.pode_ver_historico_vendas}
            <Menu titulo="Loja" icon="fa6-solid:store" width="w-64">
              {#if data.sessao.gpe.pode_iniciar_venda}
                <MenuItem href="/loja/vender" titulo="Iniciar Venda" icon="mdi:point-of-sale" />
              {/if}
              {#if data.sessao.gpe.pode_ver_estoque_disponivel}
                <MenuItem href="/loja/disponivel" titulo="Estoque Disponível" icon="mdi:cart-check" />
              {/if}
              {#if data.sessao.gpe.pode_ver_historico_vendas}
                <MenuItem href="/loja/histórico" titulo="Histórico de Vendas" icon="mdi:receipt-text-clock" />
              {/if}
            </Menu>
          {/if}
          {#if data.sessao.gpe.pode_ver_estoque || data.sessao.gpe.pode_entrada_estoque || data.sessao.gpe.pode_saida_estoque}
            <Menu titulo="Inventário" icon="mdi:warehouse">
              {#if data.sessao.gpe.pode_ver_estoque}
                <MenuItem href="/estoque" titulo="Estoque" icon="fluent-mdl2:product-list" />
              {/if}
              {#if data.sessao.gpe.pode_entrada_estoque}
                <MenuItem href="/estoque/entradas" titulo="Entradas" icon="ri:inbox-archive-fill" />
              {/if}
              {#if data.sessao.gpe.pode_saida_estoque}
                <MenuItem href="/estoque/saidas" titulo="Saídas" icon="ri:inbox-unarchive-fill" />
              {/if}
            </Menu>
          {/if}
          {#if data.sessao.gpe.pode_ver_saldo || data.sessao.gpe.pode_transacao_receita || data.sessao.gpe.pode_transacao_despesa}
            <Menu titulo="Transações" icon="ic:round-currency-exchange">
              {#if data.sessao.gpe.pode_ver_saldo}
                <MenuItem href="/transacoes/saldo" titulo="Saldo" icon="fa6-solid:coins" />
              {/if}
              {#if data.sessao.gpe.pode_transacao_receita}
                <MenuItem href="/transacoes/entrada" titulo="Receitas" icon="iconoir:receive-dollars" />
              {/if}
              {#if data.sessao.gpe.pode_transacao_despesa}
                <MenuItem href="/transacoes/saida" titulo="Despesas" icon="iconoir:send-dollars" />
              {/if}
            </Menu>
          {/if}
          {#if data.sessao.gpe.pode_cadastrar_usuario || data.sessao.gpe.pode_cadastrar_conta || data.sessao.gpe.pode_cadastrar_produto || data.sessao.gpe.pode_cadastrar_pessoa}
            <Menu titulo="Cadatros" icon="fa6-solid:book">
              {#if data.sessao.gpe.pode_cadastrar_usuario}
                <MenuItem href="/cadastros/usuarios" titulo="Usuários" icon="mdi:user-key" />
              {/if}
              {#if data.sessao.gpe.pode_cadastrar_conta}
                <MenuItem href="/cadastros/contas" titulo="Contas" icon="guidance:bank" />
              {/if}
              {#if data.sessao.gpe.pode_cadastrar_produto}
                <MenuItem href="/cadastros/produtos" titulo="Produtos" icon="fluent-mdl2:product-variant" />
              {/if}
              {#if data.sessao.gpe.pode_cadastrar_pessoa}
                <MenuItem href="/cadastros/pessoas" titulo="Pessoas" icon="mdi:account-group" />
              {/if}
            </Menu>
          {/if}
        {:else if data?.sessao?.perm > 0}
          <Menu href="/perfil/empresas" titulo="Cadastre a sua empresa para ver as opções" icon="mdi:registered-trademark" />
        {/if}
      </div>
      <svelte:fragment slot="trail">
        {#if data?.sessao?.empresa?.nome_fantasia}
          <a href class="btn btn-sm variant-soft-surface hover:variant-soft-primary grid place-items-center">
            <h5 class="h5 text-center flex gap-1 items-center">
              <Icon icon="fa6-solid:building" />
              {data.sessao.empresa.nome_fantasia}
            </h5>
            <!-- <div class="flex items-center gap-1 italic text-xs text-secondary-500-400-token">
               <Icon icon="fa6-solid:rotate" />
               <span>Trocar Empresa</span>
             </div> -->
          </a>
        {/if}
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
            {#if data?.sessao?.perm == PERM_APP_MASTER}
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

  <main class="p-2 h-full overflow-x-auto bg-surface-50-900-token">
    <slot />
  </main>

  <svelte:fragment slot="pageFooter">
    <DevAccordion />
  </svelte:fragment>
</AppShell>
