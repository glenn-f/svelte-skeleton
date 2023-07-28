<script>
  import IconButton from '$lib/components/IconButton.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormProduto from './ModalFormProduto.svelte'
  export let formData, categorias, initialData = undefined

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormProduto, props: { modo: 'editar', initialData, categorias, formData } }
    })
  }
</script>

<div class="flex flex-nowrap gap-3">
  <!-- <IconButton href="usuarios/1" icon="fa6-solid:arrow-up-right-from-square">Abrir Detalhes</IconButton> -->
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square">Editar</IconButton>
</div>
