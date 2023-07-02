<script>
  import { SlideToggle, modalStore } from '@skeletonlabs/skeleton'
  import IconButton from '$lib/components/IconButton.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let formData, initialData, permOptions
  /** @type {HTMLFormElement}*/
  let form
  function handleAlternar(e) {
    e.preventDefault()
    form.submit()
  }
  const checked = !initialData.delecao
</script>

<div class="flex flex-nowrap gap-3">
  <form bind:this={form} action="?/alternarStatus" method="POST">
    <input type="hidden" name="id" value={initialData.id} />
    <SlideToggle on:click={handleAlternar} name="status" {checked} size="sm" active="bg-green-500" background="bg-red-400">{checked ? 'Ativo' : 'Inativo'}</SlideToggle>
  </form>
</div>
