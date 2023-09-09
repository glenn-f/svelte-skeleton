<script>
  import Icon from '@iconify/svelte'
  import Label from './Label.svelte'
  import { isSvelteStore } from '$lib/helpers'
  import { getContext } from 'svelte'

  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
  /** @type {?string} Nome do formulpario*/
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
  /** @type {?string} */
  export let autocomplete = 'off'
  /** @type {?string} */
  export let placeholder = undefined
  export let readonly = undefined
  let input
  function changeInputVisibility() {
    if (input.type === 'password') {
      input.type = 'text'
    } else {
      input.type = 'password'
    }
  }
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
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim !px-2">
      <Icon icon="mdi:lock" width="28px" height="28px" />
    </div>
    <input
      bind:this={input}
      class:input-success={success && !warning && !error}
      class:input-warning={warning && !error}
      class:input-error={error}
      type="password"
      {readonly}
      {autocomplete}
      {placeholder}
      class={'read-only:variant-filled-surface ' + inputClass}
      {name}
      {required}
      bind:value
    />
    <span
      class="!px-2 grid place-items-center hover:bg-surface-hover-token"
      on:click={changeInputVisibility}
      role="button"
      tabindex="-1"
      on:keydown={(e) => ['Enter', 'NumpadEnter', 'Space', 'Return'].includes(e.code) && changeInputVisibility()}
    >
      <Icon icon={input?.type === 'password' ? 'ph:eye-closed' : 'ph:eye'} width="24px" height="24px" />
    </span>
  </div>
</Label>
