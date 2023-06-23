<script context="module">
  let id = 0
</script>

<script>
  import { Autocomplete, popup } from '@skeletonlabs/skeleton'

  import Label from './Label.svelte'

  /** @type {?string} */
  export let label
  /** @type {any} */
  export let required = undefined
  /** @type {?string} */
  export let placeholder
  /** @type {?string} */
  export let name
  /** @type {?any} */
  export let value = ''
  /** @type {?(string | string[])} */
  export let error
  /** @type {?string} */
  export let warning
  /** @type {?string} */
  export let success
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
  /** @type {?string} */
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
  let selectPopup
  const selectPopupId = 'InputSelect' + id++
  let popupSettings = {
    event: 'focus-click',
    target: selectPopupId,
    placement: 'bottom'
  }
  function onPopupDemoSelect(event) {
    selectPopup = event.detail.label
  }
  const flavorOptions = [
    { label: 'Vanilla', value: 'vanilla', keywords: 'plain, basic', meta: { healthy: false } },
    { label: 'Chocolate', value: 'chocolate', keywords: 'dark, white', meta: { healthy: false } },
    { label: 'Strawberry', value: 'strawberry', keywords: 'fruit', meta: { healthy: true } },
    { label: 'Neapolitan', value: 'neapolitan', keywords: 'mix, strawberry, chocolate, vanilla', meta: { healthy: false } },
    { label: 'Pineapple', value: 'pineapple', keywords: 'fruit', meta: { healthy: true } },
    { label: 'Peach', value: 'peach', keywords: 'fruit', meta: { healthy: true } }
  ]
</script>

<Label>
  <input class="input autocomplete" type="search" name="autocomplete-search" bind:value={selectPopup} {required} placeholder="Search..." use:popup={popupSettings} />
  <div class="card w-full p-2 overflow-y-auto !mt-0" data-popup={selectPopupId}>
    <Autocomplete bind:input={selectPopup} options={flavorOptions} on:selection={onPopupDemoSelect} />
  </div>
</Label>
