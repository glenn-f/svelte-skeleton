<script>
  import Icon from '@iconify/svelte'
  export let id
</script>

<form method="POST">
  <button name="id" value={id} formaction="?/edit">
    <Icon icon="fa6-solid:pen-to-square" />
  </button>
</form>
