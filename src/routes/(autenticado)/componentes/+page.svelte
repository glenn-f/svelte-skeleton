<script>
  import InputEmail from '../../../lib/components/Forms/InputEmail.svelte'
  import InputPassword from '../../../lib/components/Forms/InputPassword.svelte'
  import InputSelect from '../../../lib/components/Forms/InputSelect.svelte'
  import InputText from '../../../lib/components/Forms/InputText.svelte'
  import InputUrl from '../../../lib/components/Forms/InputUrl.svelte'

  let nome = ''

  let error, warning, success
</script>

<InputSelect />
<InputUrl required name="nome" label="www" placeholder="Digite seu www" bind:value={nome} {error} {warning} {success} />
<br />
<br />
<br />
<br />

error
<input type="text" name="" id="" bind:value={error} class="input" />
warning
<input type="text" name="" id="" bind:value={warning} class="input" />
success
<input type="text" name="" id="" bind:value={success} class="input" />
