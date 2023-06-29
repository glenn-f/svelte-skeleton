<script>
  import { modalStore } from '@skeletonlabs/skeleton'
  import IconButton from '$lib/components/IconButton.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let row, permOptions

  let formData = { data: row }

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'editar', formData, permOptions } }
    })
  }

  function handleApagar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'apagar', formData, permOptions } }
    })
  }
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square">Editar</IconButton>
  <IconButton on:click={handleApagar} icon="fa6-solid:trash-can">Apagar</IconButton>
  <IconButton href="usuarios/1" icon="fa6-solid:arrow-up-right-from-square">Abrir Detalhes</IconButton>
</div>
