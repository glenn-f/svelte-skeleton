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
      <TabAnchor href="/cadastros/usuarios" selected={$page.url.pathname === '/cadastros/usuarios'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="carbon:credentials" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Usuários</span>
      </TabAnchor>
      <TabAnchor href="/cadastros/usuarios/grupos" selected={$page.url.pathname === '/cadastros/usuarios/grupos'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="carbon:group-access" width="32px" height="32px" />
          </div>
        </svelte:fragment>
        <span>Grupos</span>
      </TabAnchor>
      <div class="bg-surface-100-800-token p-2 rounded-b-md" slot="panel">
        <slot />
      </div>
    </TabGroup>
  </div>
</div>
