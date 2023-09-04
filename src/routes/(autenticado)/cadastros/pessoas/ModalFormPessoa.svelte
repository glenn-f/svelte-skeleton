<script>
  import { browser } from '$app/environment'
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputDate from '$lib/components/Forms/InputDate.svelte'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputMask from '$lib/components/Forms/InputMask.svelte'
  import InputTelefone from '$lib/components/Forms/InputTelefone.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import Label from '$lib/components/Forms/Label.svelte'
  import { PESSOA_FISICA, PESSOA_JURIDICA, REP_CLIENTE, REP_COLABORADOR, REP_FORNECEDOR } from '$lib/globals'
  import { RadioGroup, RadioItem, getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'

  const modalStore = getModalStore()
  const toastStore = getToastStore()
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData

  const { form, errors, enhance, message } = superForm(formData, {
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

  let action, titulo, input
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
  }

  onMount(() => {
    if (modo == 'colaborador') $form = { rep: REP_COLABORADOR, tipo_pessoa: PESSOA_FISICA }
    else if (modo == 'cliente') $form = { rep: REP_CLIENTE, tipo_pessoa: PESSOA_FISICA }
    else if (modo == 'fornecedor') $form = { rep: REP_FORNECEDOR, tipo_pessoa: PESSOA_JURIDICA }
    else if (modo == 'adicionar') $form = {}
    else $form = { ...initialData }
    $errors = {}
    $message = ''
    input.focus()
  })
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Pessoa</h2>
    </svelte:fragment>
    <section class="grid grid-cols-12 gap-1 px-3">
      <Label label="Relação com a Empresa" labelClass="col-span-7 flex flex-col items-center" error={$errors.tipo_associacao} required>
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
        <InputText
          bind:input
          label={$form.tipo_pessoa === PESSOA_JURIDICA ? 'Nome Fantasia' : 'Nome Completo'}
          placeholder="Ex: Enzo Gabriel"
          name="nome"
          bind:value={$form.nome}
          error={$errors.nome}
          errorSpacing
          required
        />
      </div>
      <div class="col-span-7">
        <InputEmail label="E-mail" placeholder="Ex: enzo.gabriel@email.com" name="email" bind:value={$form.email} error={$errors.email} errorSpacing />
      </div>
      {#if $form.tipo_pessoa === PESSOA_FISICA}
        <div class="col-span-5">
          <InputMask mask="000.000.000-00" label="CPF" name="cpf" bind:value={$form.cpf} error={$errors.cpf} errorSpacing />
        </div>
      {/if}
      {#if $form.tipo_pessoa === PESSOA_JURIDICA}
        <div class="col-span-5">
          <InputMask mask="00.000.000/0000-00" label="CNPJ" name="cnpj" bind:value={$form.cnpj} error={$errors.cnpj} errorSpacing />
        </div>
      {/if}
      {#if $form.tipo_pessoa === PESSOA_FISICA}
        <div class="col-span-4">
          <InputText label="RG" name="rg" bind:value={$form.rg} error={$errors.rg} errorSpacing />
        </div>
        <div class="col-span-3">
          <InputDate name="dn" label="Data de Nascimento" bind:value={$form.dn} error={$errors.dn} errorSpacing />
        </div>
        <Label label="Sexo Biológico" labelClass="col-span-5 flex flex-col items-center" error={$errors.sexo}>
          <RadioGroup active="bg-primary-500" background="variant-glass" hover="variant-soft hover:variant-soft-primary">
            <RadioItem bind:group={$form.sexo} name="sexo" value={1}>Masculino</RadioItem>
            <RadioItem bind:group={$form.sexo} name="sexo" value={2}>Feminino</RadioItem>
          </RadioGroup>
        </Label>
      {/if}

      {#if $form.tipo_pessoa === PESSOA_FISICA || $form.tipo_pessoa === PESSOA_JURIDICA}
        <div class="col-span-6">
          <InputMask bind:value={$form.cep} error={$errors.cep} mask="00000-000" label="CEP" name="cep" errorSpacing />
        </div>
      {/if}

      {#if $form.tipo_pessoa === PESSOA_FISICA || $form.tipo_pessoa === PESSOA_JURIDICA}
        <div class="col-span-6">
          <InputTelefone label="Telefone" name="telefone" bind:value={$form.telefone} error={$errors.telefone} errorSpacing />
        </div>
      {/if}

      <div class="col-span-12">
        <InputText label="Endereço" name="endereco" bind:value={$form.endereco} error={$errors.endereco} errorSpacing />
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={initialData?.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
