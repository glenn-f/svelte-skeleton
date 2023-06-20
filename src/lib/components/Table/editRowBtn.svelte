<script>
	import { rowChanges } from './stores.js';
  import Icon from '@iconify/svelte'

  export let row
  let isEdit = false

  function setEditRow(id, val) {
    isEdit = val
    rowChanges.update((rowChanges) => {
      const currState = { ...rowChanges }
      if (val === false && id in currState) {
        delete currState[id]
      } else {
        currState[id] = { ...row }
      }

      return currState
    })
  }
</script>

{#if isEdit}
  <button type="button" class="btn-icon" on:click={() => setEditRow(row.id, false)}><Icon icon="fa6-solid:x" class="text-error-500-400-token"/></button>
{:else}
  <button type="button" class="btn-icon" on:click={() => setEditRow(row.id, true)}><Icon icon="fa6-solid:pen-to-square" class="text-primary-500"/></button>
{/if}
