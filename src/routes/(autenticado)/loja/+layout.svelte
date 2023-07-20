<script>
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton'
</script>

<div class="grid place-items-center">
  <div class="container">
    <TabGroup
      regionPanel="!mt-0"
      justify="justify-start"
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
      flex="flex-1 lg:flex-none"
      rounded="rounded-t-md"
      class="!-0 bg-surface-200-700-token w-full rounded-container-token shadow-md"
    >
      <TabAnchor href="/loja/vender" selected={$page.url.pathname === '/loja/vender'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:point-of-sale" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Efetuar Venda</span>
      </TabAnchor>
      <TabAnchor href="/loja/disponivel" selected={$page.url.pathname === '/loja/disponivel'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:cart-check" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Estoque Disponível</span>
      </TabAnchor>
      <TabAnchor href="/loja/historico" selected={$page.url.pathname === '/loja/historico'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:receipt-text-clock" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Histórico de Vendas</span>
      </TabAnchor>
      <div class="bg-surface-100-800-token p-2 rounded-b-md" slot="panel">
        <slot />
      </div>
    </TabGroup>
  </div>
</div>
