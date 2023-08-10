<script>
  import { formatInteger, formatMoeda } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  export let value
  /** @type {'integer' | 'currency'} */
  export let type = 'integer'
  $: absValue = Math.abs(value || 0)
  $: textValue = type === 'integer' ? formatInteger(absValue) : formatMoeda(absValue)
</script>

<div class="flex gap-1 justify-center items-center" class:text-green-600={value > 0} class:text-red-600={value < 0} class:text-blue-600={!value}>
  {#if value > 0}
    <Icon icon="fa6-solid:plus" />
  {:else if value < 0}
    <Icon icon="fa6-solid:minus" />
  {:else}
    <Icon icon="fa6-solid:plus-minus" />
  {/if}
  {textValue}
</div>
