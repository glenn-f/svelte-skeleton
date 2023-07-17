<script>
  import InputMask from './../../../../lib/components/Forms/InputMask.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import HelperMessage from '../../../../lib/components/Forms/HelperMessage.svelte'
  import { invalidateAll } from '$app/navigation'
  import { RadioGroup, RadioItem, modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputPassword from '$lib/components/Forms/InputPassword.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import CardModal from '$lib/components/CardModal.svelte'
  import Label from '../../../../lib/components/Forms/Label.svelte'
  import InputDate from '../../../../lib/components/Forms/InputDateTime.svelte'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar' | 'apagar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Lista de opções de permissões que um usuário pode ter
   * @type {Map<number, {label: string}>} */
  export let permOptions
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  const { form, errors, enhance, reset, message } = superForm(formData, {
    resetForm: true,
    taintedMessage: false,
    onResult: async ({ result, cancel, formEl }) => {
      const message = result.data?.form?.message
      if (result.type == 'success') {
        cancel()
        formEl.reset()
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        modalStore.close()
        invalidateAll()
      }
    }
  })

  let action, titulo, pw_placeholder
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
    pw_placeholder = 'Não alterado'
  } else if (modo == 'apagar') {
    action = '?/apagar'
    titulo = 'Apagar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
    pw_placeholder = ''
  }

  function onClose() {
    reset()
    modalStore.close()
  }
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Pessoa</h2>
    </svelte:fragment>
    <!-- <SuperDebug data={$form} /> -->
    <section class="grid grid-cols-12 gap-1 px-3">
      <Label label="Associação com a Empresa" labelClass="col-span-7 flex flex-col items-center" error={$errors.tipo_associacao} required>
        <RadioGroup active="bg-primary-500" background="variant-glass" hover="variant-soft hover:variant-soft-primary">
          <RadioItem bind:group={$form.rep} name="rep" value={1}>Colaborador</RadioItem>
          <RadioItem bind:group={$form.rep} name="rep" value={2}>Cliente</RadioItem>
          <RadioItem bind:group={$form.rep} name="rep" value={3}>Fornecedor</RadioItem>
        </RadioGroup>
      </Label>
      <Label label="Tipo de Pessoa" labelClass="col-span-5 flex flex-col items-center" error={$errors.tipo_pessoa} required>
        <RadioGroup active="bg-primary-500" background="variant-glass" hover="variant-soft hover:variant-soft-primary">
          <RadioItem title="Pessoa Física" bind:group={$form.tipo_pessoa} name="tipo_pessoa" value={1}>Física</RadioItem>
          <RadioItem title="Pessoa Jurídica" bind:group={$form.tipo_pessoa} name="tipo_pessoa" value={2}>Jurídica</RadioItem>
        </RadioGroup>
      </Label>
      <div class="col-span-12">
        <InputText label="Nome" placeholder="Ex: Enzo Gabriel" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <div class="col-span-5">
        <InputMask mask="000.000.000-00" label="CPF" name="cpf" bind:value={$form.cpf} error={$errors.cpf} errorSpacing  />
      </div>
      <div class="col-span-7">
        <InputMask mask="00.000.000/0000-00" label="CNPJ" name="cnpj" bind:value={$form.cnpj} error={$errors.cnpj} errorSpacing  />
      </div>
      <div class="col-span-6">
        <InputEmail label="E-mail" placeholder="Ex: enzo.gabriel@email.com" name="email" bind:value={$form.email} error={$errors.email} errorSpacing  />
      </div>
      <div class="col-span-6">
        <InputText label="RG" name="rg" bind:value={$form.rg} error={$errors.rg} errorSpacing  />
      </div>
      <Label label="Sexo Biológico" labelClass="col-span-6 flex flex-col items-center" error={$errors.sexo} >
        <RadioGroup active="bg-primary-500" background="variant-glass" hover="variant-soft hover:variant-soft-primary">
          <RadioItem bind:group={$form.sexo} name="sexo" value={1}>Masculino</RadioItem>
          <RadioItem bind:group={$form.sexo} name="sexo" value={2}>Feminino</RadioItem>
        </RadioGroup>
      </Label>
      <div class="col-span-3">
        <InputDate name="dn" label="Data de Nascimento" error={$errors.sexo} errorSpacing />
      </div>
      <div class="col-span-3">
        <InputMask mask="00000-000" label="CEP" name="cep" bind:value={$form.cep} error={$errors.cep} errorSpacing  />
      </div>
      <div class="col-span-12">
        <InputText label="Endereço" name="endereco" bind:value={$form.endereco} error={$errors.endereco} errorSpacing  />
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={formData.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={onClose}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
