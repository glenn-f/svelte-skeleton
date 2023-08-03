<script>
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton'
</script>

{#if ['/estoque/inventario', '/estoque/entradas', '/estoque/saidas'].includes($page.url.pathname)}
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
        <TabAnchor href="/estoque/inventario" selected={$page.url.pathname.startsWith('/estoque/inventario')}>
          <svelte:fragment slot="lead">
            <div class="grid place-items-center">
              <Icon icon="fluent-mdl2:product-list" width="32px" height="32px" />
            </div>
          </svelte:fragment>
          <span>Inventário</span>
        </TabAnchor>
        <TabAnchor href="/estoque/entradas" selected={$page.url.pathname.startsWith('/estoque/entradas')}>
          <svelte:fragment slot="lead">
            <div class="grid place-items-center">
              <Icon icon="ri:inbox-archive-fill" width="32px" height="32px" />
            </div>
          </svelte:fragment>
          <span>Entradas</span>
        </TabAnchor>
        <TabAnchor href="/estoque/saidas" selected={$page.url.pathname.startsWith('/estoque/saidas')}>
          <svelte:fragment slot="lead">
            <div class="grid place-items-center">
              <Icon icon="ri:inbox-unarchive-fill" width="32px" height="32px" />
            </div>
          </svelte:fragment>
          <span>Saídas</span>
        </TabAnchor>
        <div class="bg-surface-100-800-token p-2 rounded-b-md" slot="panel">
          <slot />
        </div>
      </TabGroup>
    </div>
  </div>
{:else}
  <slot />
{/if}
