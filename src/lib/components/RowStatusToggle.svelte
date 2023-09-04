<script>
  import { enhance } from '$app/forms'
  import { SlideToggle, getToastStore } from '@skeletonlabs/skeleton'
  const toastStore = getToastStore()
  export let checked,
    id,
    disabled = undefined
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
  class="w-28"
>
  <input type="hidden" name="id" value={id} />
  <SlideToggle {disabled} on:click={handleAlternar} {name} {checked} size="sm" active="bg-green-500" background="bg-red-400">
    {#if checked}
      Ativo &nbsp;&nbsp;
    {:else}
      Inativo
    {/if}
  </SlideToggle>
</form>
