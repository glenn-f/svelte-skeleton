<script>
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import Label from './Label.svelte'
  import { objectToArray } from '$lib/helpers'
  /**
   * Função aplicada em cada opção do `select` para gerar o rótulo da opção.
   * @param {any} option Uma opção da lista de opções `options`.
   * @param {any} index O índice da opção na lista.
   * @returns {string} O rótulo da opção.
   */
  export let getOptionLabel = (option, index) => option?.label ?? option
  /**
   * Função aplicada em cada opção do `select` para gerar o valor da opção.
   * @param {any} option Uma opção da lista de opções `options`.
   * @param {any} index O índice da opção na lista.
   * @returns {any} O valor da opção.
   */
  export let getOptionValue = (option, index) => option?.value ?? index
  export let getDisabled = (option, index) => undefined
  export let label = undefined,
    error = undefined,
    required = undefined,
    readonly = undefined
  export let value,
    name,
    options = []
  const _options = objectToArray(options)
</script>

<Label {label} labelClass="col-span-7 flex flex-col items-center" {error} required>
  <RadioGroup active="bg-primary-500"  background="variant-glass" hover="variant-soft hover:variant-soft-primary">
    {#each _options as [index, option]}
      <RadioItem bind:group={value} {name} {required} {readonly} value={getOptionValue(option, index)} disabled={getDisabled(option, index)}>{getOptionLabel(option, index)}</RadioItem>
    {/each}
  </RadioGroup>
</Label>
