<script>
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton'
  export let data
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
      <TabAnchor href="/perfil" selected={$page.url.pathname === '/perfil'}>
        <svelte:fragment slot="lead">
          <div class="grid place-items-center">
            <Icon icon="fa6-solid:user-lock" width="24px" height="24px" />
          </div>
        </svelte:fragment>
        <span>Meus Dados</span>
      </TabAnchor>
      {#if data.perm > 0}
        <TabAnchor href="/perfil/empresas" selected={$page.url.pathname === '/perfil/empresas'}>
          <svelte:fragment slot="lead">
            <div class="grid place-items-center">
              <Icon icon="fa6-solid:building-user" width="24px" height="24px" />
            </div>
          </svelte:fragment>
          <span>Minha Empresa</span>
        </TabAnchor>
      {/if}
      <div class="bg-surface-100-800-token p-2 rounded-b-md" slot="panel">
        <slot />
      </div>
    </TabGroup>
  </div>
</div>
