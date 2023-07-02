<script>
  import { enhance } from '$app/forms'
  import { SlideToggle, toastStore } from '@skeletonlabs/skeleton'
  export let formData, initialData, permOptions
  /** @type {HTMLFormElement}*/
  let form
  async function handleAlternar(e) {
    e.preventDefault()
    form.requestSubmit()
  }
  const checked = !initialData.delecao
</script>

<div class="flex flex-nowrap gap-3">
  <form
    bind:this={form}
    action="?/alternarStatus"
    method="POST"
    use:enhance={(_) => {
      return ({result, update}) => {
        if (result.data.form.valid) {
          toastStore.trigger({ message: result.data.form.message, background: "variant-filled-success"})
        } else {
          toastStore.trigger({ message: result.data.form.message, background: "variant-filled-error"})
        }
        
        update()
      }
    }}
  >
    <input type="hidden" name="id" value={initialData.id} />
    <SlideToggle on:click={handleAlternar} name="status" {checked} size="sm" active="bg-green-500" background="bg-red-400">{checked ? 'Ativo' : 'Inativo'}</SlideToggle>
  </form>
</div>
