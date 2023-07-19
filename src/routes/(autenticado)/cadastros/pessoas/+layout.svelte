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
      <TabAnchor href="/cadastros/pessoas" active="variant-filled-secondary" selected={$page.url.pathname === '/cadastros/pessoas'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:account-group-outline" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Todas Pessoas</span>
      </TabAnchor>
      <TabAnchor href="/cadastros/pessoas/colaboradores" selected={$page.url.pathname === '/cadastros/pessoas/colaboradores'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:worker" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Colaboradores</span>
      </TabAnchor>
      <TabAnchor href="/cadastros/pessoas/clientes" selected={$page.url.pathname === '/cadastros/pessoas/clientes'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:account-star" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Clientes</span>
      </TabAnchor>
      <TabAnchor href="/cadastros/pessoas/fornecedores" selected={$page.url.pathname === '/cadastros/pessoas/fornecedores'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="mdi:human-dolly" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Fornecedores</span>
      </TabAnchor>
      <div class="bg-surface-100-800-token p-2 rounded-b-md" slot="panel">
        <slot />
      </div>
    </TabGroup>
  </div>
</div>
