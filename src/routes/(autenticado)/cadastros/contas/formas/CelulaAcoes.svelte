<script>
  import IconButton from '$lib/components/IconButton.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormForma from './ModalFormForma.svelte'
  export let formData, initialData, contas

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormForma, props: { modo: 'editar', initialData, formData, contas } }
    })
  }
</script>

<div class="flex flex-nowrap gap-3">
  <!-- <IconButton href="usuarios/1" icon="fa6-solid:arrow-up-right-from-square">Abrir Detalhes</IconButton> -->
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square">Editar</IconButton>
</div>
