<script>
  import { enhance } from '$app/forms'
  import { SlideToggle, toastStore } from '@skeletonlabs/skeleton'
  export let checked, id, disabled = undefined
  export let action = '?/alternarStatus',
    method = 'POST',
    name = 'status'
  /** @type {HTMLFormElement}*/
  let form
  async function handleAlternar(e) {
    e.preventDefault()
    form.requestSubmit()
  }
</script>

<div class="flex flex-nowrap gap-3">
  <form
    bind:this={form}
    {action}
    {method}
    use:enhance={(_) => {
      return ({ result, update }) => {
        if (result.data.form.valid) {
          toastStore.trigger({ message: result.data.form.message, background: 'variant-filled-success' })
        } else {
          toastStore.trigger({ message: result.data.form.message, background: 'variant-filled-error' })
        }
        update()
      }
    }}
  >
    <input type="hidden" name="id" value={id} />
    <SlideToggle {disabled} on:click={handleAlternar} {name} {checked} size="sm" active="bg-green-500" background="bg-red-400">{checked ? 'Ativo' : 'Inativo'}</SlideToggle>
  </form>
</div>
