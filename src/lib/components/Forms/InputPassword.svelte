<script>
  import Icon from '@iconify/svelte'
  import Label from './Label.svelte'

  /** @type {?string} */
  export let label = undefined
  /** @type {?boolean} */
  export let required = undefined
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
  let x
  function changeInputVisibility() {
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
</script>

<Label {label} {error} {warning} {success} {errorSpacing} {labelClass} {required}>
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim !px-2">
      <Icon icon="mdi:lock" width="28px" height="28px" />
    </div>
    <input
      bind:this={x}
      class:input-success={success && !warning && !error}
      class:input-warning={warning && !error}
      class:input-error={error}
      type="password"
      class={'input ' + inputClass}
      {name}
      {required}
      bind:value
    />
    <span class='!px-2 grid place-items-center hover:bg-surface-hover-token' on:click={changeInputVisibility}>
      <Icon icon={x?.type === "password"?"ph:eye-closed":"ph:eye"} width="24px" height="24px" />
    </span>
  </div>
</Label>
