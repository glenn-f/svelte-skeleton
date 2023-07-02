<script context="module">
  let id = 0
</script>

<script>
  import MenuDivider from './MenuDivider.svelte'
  import MenuItem from './MenuItem.svelte'
  import { popup } from '@skeletonlabs/skeleton'
  import Icon from '@iconify/svelte'
  export let href = '',
    titulo = 'Menu',
    icon,
    width = 'w-52'
  let target = 'AppBarItem' + id++
</script>

{#if $$slots.default}
  <!-- button -->
  <a {href} class="btn btn-sm variant-soft-surface hover:variant-soft-primary" use:popup={{ target, event: 'click', placement: 'bottom', closeQuery: 'a' }}>
    {#if icon} <Icon {icon} width="24px" height="24px" /> {/if}
    <span class="h6">{titulo}</span>
    <Icon icon="fa6-solid:caret-down" />
  </a>
  <!-- popup -->
  <div class={'card p-2 shadow-xl bg-surface-200-700-token ' + width} data-popup={target}>
    <nav class="list-nav">
      <ul>
        <slot>
          <MenuItem href="#" titulo="Menu Item 1" icon="fa6-solid:cube" />
          <MenuDivider />
          <MenuItem href="#" titulo="Menu Item 2" icon="fa6-solid:fire" />
        </slot>
      </ul>
    </nav>
  </div>
{:else}
  <a {href} class="btn hover:variant-soft-primary">
    {#if icon} <Icon {icon} width="24px" height="24px" /> {/if}
    <span class="h6 uppercase">{titulo}</span>
  </a>
{/if}
