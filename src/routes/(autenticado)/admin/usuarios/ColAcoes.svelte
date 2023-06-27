<script>
  import Icon from '@iconify/svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import FormEditarUsuario from './FormEditarUsuario.svelte'
  export let dataRow, permOptions

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: FormEditarUsuario,
        props: { dataRow, permOptions },
        slot: '<p>Skeleton</p>'
      }
    })
  }
</script>

<button name="id" on:click|preventDefault={handleEditar}>
  <Icon icon="fa6-solid:pen-to-square" />
</button>
