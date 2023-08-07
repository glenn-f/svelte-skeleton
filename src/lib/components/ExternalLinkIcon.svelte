<script>
  import Icon from "@iconify/svelte"

  export let href="#"
</script>

<a {href} {...$$restProps}>
  <Icon icon="fa6-solid:arrow-up-right-from-square" class='anchor hover:animate-pulse'/>
</a>