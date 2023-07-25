<script>
  // Import the necessary modules from Svelte
  import { setContext } from 'svelte'

  /** Dados do Formulário @type {Object<string, any>} */
  export let formStore = {}
  /** ID do Formulário @type {string | undefined} */
  export let id = undefined
  /** Dados do Formulário @type {string | undefined} */
  export let action = undefined
  /** Dados do Formulário @type {"GET" | "POST" | undefined} */
  export let method = undefined

  export let enhance = formStore.enhance

  // Set the form data in the context when the component is mounted
  setContext('formStore', formStore)
</script>

<!-- Form Markup -->
<form {id} {action} {method} use:enhance {...$$restProps}>
  <slot />
</form>
