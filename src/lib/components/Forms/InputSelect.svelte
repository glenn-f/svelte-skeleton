<script>
  import { objectToArray } from '$lib/helpers'
  import Label from './Label.svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext } from 'svelte'

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
  export let placeholderEnabled = false
  export let getDisabled = (option, index) => undefined
  export let readonly = undefined
  const _options = objectToArray(options)

  const formStore = getContext('formStore')

  if (isSvelteStore(formStore)) {
    value = $formStore[name]
  }

  function updateContext(value) {
    if (isSvelteStore(formStore)) {
      $formStore[name] = value
    }
  }
  $: updateContext(value)
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
      <option value={undefined} disabled={!placeholderEnabled} selected>{placeholder}</option>
    {/if}
    {#each _options as [index, option]}
      {@const disabled = typeof getDisabled == 'function' ? getDisabled(option, index) : option[getDisabled]}
      {@const value = typeof getOptionValue == 'function' ? getOptionValue(option, index) : option[getOptionValue]}
      {@const label = typeof getOptionLabel == 'function' ? getOptionLabel(option, index) : option[getOptionLabel]}
      <option class="text-token" {disabled} {value}>{label}</option>
    {/each}
  </select>
</Label>
