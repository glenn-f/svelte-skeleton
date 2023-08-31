<script>
  import IconButton from '$lib/components/IconButton.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormGrupos from './ModalFormGrupos.svelte'
  export let formData, initialData, permOptions

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormGrupos, props: { modo: 'editar', initialData: { ...initialData }, permOptions, formData } }
    })
  }
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square" data-tooltip="Editar" data-placement="left" />
</div>
