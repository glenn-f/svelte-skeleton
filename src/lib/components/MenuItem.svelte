<script>
  import Icon from '@iconify/svelte'
  export let href,
    icon = 'fa6-solid:caret-right',
    titulo = 'Menu Item'
</script>

<li>
  <a {href}>
    <Icon {icon} width="24px" height="24px" />
    <span>{titulo}</span>
  </a>
</li>
