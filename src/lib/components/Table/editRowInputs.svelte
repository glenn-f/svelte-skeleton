<script>
	import { rowChanges } from './stores.js';

  export let id
  export let colId
  export let editT
  export let initVal

  let rInEdit = false
  let changedRow = {}
  rowChanges.subscribe((r) => {
    if (r[id]) {
      rInEdit = true
    } else {
      rInEdit = false
    }

    changedRow = r[id] ?? {}
  })
</script>

{#if rInEdit !== true}
  <span>{initVal}</span>
{:else if editT === 'text'}
  <input type="text" class="input" bind:value={changedRow[colId]} />
{:else if editT === 'number'}
  <input type="number" class="input" bind:value={changedRow[colId]} />
{:else}
  <span>{initVal}</span>
{/if}
