<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputDate from '$lib/components/Forms/InputDate.svelte'
  import InputEmail from '$lib/components/Forms/InputEmail.svelte'
  import InputMask from '$lib/components/Forms/InputMask.svelte'
  import InputTelefone from '$lib/components/Forms/InputTelefone.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import Label from '$lib/components/Forms/Label.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { PESSOA_FISICA, PESSOA_JURIDICA, mapSexo } from '$lib/globals'
  import { Autocomplete, RadioGroup, RadioItem, getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  export let store, formData, clientes
  let buscarCliente,
    clienteSelecionado,
    formCriar,
    criarCliente = false
  const modalStore = getModalStore()
  const toastStore = getToastStore()
  //ler cliente selecionado (se hoouver)
  //mostrar cliente selecionado e listagem para troca de cliente e botão para criar novo cliente
  //na listagem deve ser clicavel para escolher o cliente e ter filtro por nome e outros dados
  //ao clicar na escolha do cliente, mostrar tela de confirmação com possibildiade de volta
  //na criação de cliente, o formulario deve ser preenchido e enviar como JSON
  //o retorno da criação deve atualizar a lista de clientes (store) e o $store.participante_id e fechar o modal
  //TODO criar action para criar cliente no server.js
  $: cliente_id = $store?.participante_id
  // $: cliente = clientes?.find((v) => v.id == cliente_id)

  $: clientesAutocomplete = $clientes?.map((c) => ({ label: c.nome, value: c.id, meta: c })) ?? []
  function onSelection(event) {
    clienteSelecionado = event.detail.meta
    buscarCliente = ''
  }
  function onFinish(event) {
    if (clienteSelecionado) {
      $store.participante_id = clienteSelecionado.id
      modalStore.close()
    } else if (criarCliente && formCriar) {
      formCriar.requestSubmit()
    }
  }

  function onReset(event) {
    $store.participante_id = undefined
    modalStore.close()
  }

  const { form, errors, enhance, message } = superForm(formData, {
    invalidateAll: false,
    taintedMessage: false,
    onResult: async ({ result, cancel, formEl }) => {
      const message = result.data?.form?.message
      if (result.type == 'success') {
        cancel()
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        $store.participante_id = result.data.form.data.id
        $clientes = result.data.form.data.clientes
        modalStore.close()
      }
    }
  })

  onMount(() => {
    $form = { tipo_pessoa: PESSOA_FISICA }
    $errors = {}
    $message = ''
    clienteSelecionado = $clientes?.find((v) => v.id == cliente_id)
  })
</script>

<form bind:this={formCriar} action="?/addCliente" method="POST" use:enhance class="flex justify-center w-full">
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{!criarCliente ? 'Selecionar' : 'Criar Novo'} Cliente</h2>
    </svelte:fragment>

    {#if !criarCliente}
      <!-- content here -->
      {#if !clienteSelecionado}
        <div class="col-span-12 grid grid-cols-12 gap-1">
          <div class="col-span-7">
            <input class="input" type="search" bind:value={buscarCliente} placeholder="Buscar cliente (nome, cpf, cnpj)..." />
          </div>
          <div class="col-span-5">
            <Button
              on:click={() => {
                criarCliente = true
                clienteSelecionado = undefined
              }}
              icon="fa6-solid:plus"
              class="variant-filled-secondary w-full"
              text="Criar novo cliente"
            />
          </div>
          <div class=" col-span-12 card w-full max-h-40 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete emptyState="Nenhum cliente encontrado. Crie um novo cliente" bind:input={buscarCliente} options={clientesAutocomplete} on:selection={onSelection} />
          </div>
        </div>
      {:else}
        <div class="grid">
          <Button
            icon="fa6-solid:rotate"
            text="Escolher Outro"
            class="variant-filled-tertiary my-2"
            on:click={() => {
              clienteSelecionado = undefined
              criarCliente = false
            }}
          />
        </div>
        <div class="grid grid-cols-2 gap-1">
          <ShowBox label="Nome">{clienteSelecionado.nome}</ShowBox>
          <ShowBox label="E-mail">{clienteSelecionado.email}</ShowBox>
          <ShowBox label="Telefone">{clienteSelecionado.telefone}</ShowBox>
          <ShowBox label="CEP">{clienteSelecionado.cep}</ShowBox>
          <ShowBox class="col-span-2" label="Endereco">{clienteSelecionado.endereco}</ShowBox>
          {#if clienteSelecionado.tipo_pessoa == PESSOA_FISICA}
            <ShowBox label="Data Nascimento">{new Date(clienteSelecionado.dn).toLocaleDateString() || '-'}</ShowBox>
            <ShowBox label="Sexo">{mapSexo.get(clienteSelecionado.sexo) ?? '-'}</ShowBox>
            <ShowBox label="RG">{clienteSelecionado.rg}</ShowBox>
            <ShowBox label="CPF">{clienteSelecionado.cpf}</ShowBox>
          {:else}
            <ShowBox class="col-span-2" label="CNPJ">{clienteSelecionado.cnpj}</ShowBox>
          {/if}
        </div>
      {/if}
    {:else}
      <section class="grid grid-cols-12 gap-1 px-3">
        <Label label="Tipo de Pessoa" labelClass="col-span-6 flex flex-col items-center" error={$errors.tipo_pessoa} required>
          <RadioGroup active="bg-primary-500" background="variant-glass" hover="variant-soft hover:variant-soft-primary">
            <RadioItem title="Pessoa Física" bind:group={$form.tipo_pessoa} name="tipo_pessoa" value={1}>Física</RadioItem>
            <RadioItem title="Pessoa Jurídica" bind:group={$form.tipo_pessoa} name="tipo_pessoa" value={2}>Jurídica</RadioItem>
          </RadioGroup>
        </Label>
        <div class="col-span-6 self-end justify-self-center">
          <Button
            icon="fa6-solid:arrow-left"
            class="variant-filled-tertiary"
            on:click={() => {
              clienteSelecionado = undefined
              criarCliente = false
            }}
            text="Voltar"
          />
        </div>
        <div class="col-span-12">
          <InputText
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
    {/if}
    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if criarCliente || clienteSelecionado}
          {@const atual = $store?.participante_id == clienteSelecionado?.id && clienteSelecionado}
          <Button
            data-tooltip={atual ? 'Cliente já está selecionado' : undefined}
            disabled={atual}
            icon="fa6-solid:check"
            on:click={onFinish}
            class="variant-filled-primary"
            text={clienteSelecionado ? 'Escolher Este' : 'Criar Registro'}
          />
        {/if}
        <Button icon="fa6-solid:xmark" text="Cancelar" on:click={modalStore.close} />
        {#if $store?.participante_id}
          <Button icon="fa6-solid:eraser" class="variant-ghost-warning text-base-token dark:text-white " text="Resetar" on:click={onReset} />
        {/if}
      </div>
    </div>
  </CardModal>
</form>
