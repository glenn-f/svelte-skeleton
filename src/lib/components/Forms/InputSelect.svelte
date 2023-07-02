<script>
  import { objectToArray } from '$lib/helpers'
  import Label from './Label.svelte'

  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?string} */
  export let placeholder = undefined
  /** @type {?string} */
  export let name = undefined
  /** @type {?any} */
  export let value = undefined
  /** @type {?(string | string[])} */
  export let error = undefined
  /** @type {?string} */
  export let warning = undefined
  /** @type {?string} */
  export let success = undefined
  /** @type {true | false} Padrão `false` */
  export let errorSpacing = false
  /** @type {?string} */
  export let inputClass = ''
  /** @type {?string} */
  export let labelClass = ''
  /** @type {?{label: string value: any}[] | any[]]} Lista de opções do select. Pode possuir um campo label e outro value como padrão */
  export let options = []
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
  export let readonly = undefined
  const _options = objectToArray(options)
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <select
    class:input-success={success && !warning && !error}
    class:input-warning={warning && !error}
    class:input-error={error}
    class:text-surface-500-400-token={value === undefined}
    class={'select read-only:variant-filled-surface ' + inputClass}
    {readonly}
    {placeholder}
    {name}
    {required}
    bind:value
  >
    {#if placeholder !== undefined}
      <option value={undefined} disabled selected>{placeholder}</option>
    {/if}
    {#each _options as [index, option]}
      <option class="text-token" value={getOptionValue(option, index)}>{getOptionLabel(option, index)}</option>
    {/each}
  </select>
</Label>
