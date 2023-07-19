<script>
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import Icon from '@iconify/svelte'
  import { toastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import InputMask from '$lib/components/Forms/InputMask.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  export let data
  const { formId, form, errors, enhance, message, reset } = superForm(data.form, {
    invalidateAll: true,
    taintedMessage: false,
    onResult: async ({ result }) => {
      if (result.type == 'success') {
        const message = result.data.form.message
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        $formId = result.data.form.id
        editar = false
        result.data.form.message = ''
      }
    }
  })
  $: editar = $formId === 'criar' ? true : false
  let inputPrim

  function onEditar() {
    editar = true
    inputPrim.focus()
  }
  function onCancelar() {
    reset()
    editar = false
  }
</script>

<div class="grid grid-cols-12 gap-2">
  {#if $formId == 'criar'}
    <div class="col-span-12">Você ainda não possui uma empresa cadastrada. Cadastre abaixo a sua empresa:</div>
  {:else}
    <div class="col-span-12">
      <button type="button" class="btn variant-filled gap-1" on:click={onEditar} disabled={editar}>
        <Icon icon="fa6-solid:pen-to-square" />
        Editar Empresa
      </button>
    </div>
  {/if}
  <form method="POST" use:enhance class="card text-token bg-surface-300-600-token p-2 variant-filled col-span-12 grid grid-cols-12 gap-2">
    <div class="col-span-5">
      <InputText bind:input={inputPrim} label="Nome Fantasia" name="nome_fantasia" bind:value={$form.nome_fantasia} error={$errors.nome_fantasia} errorSpacing required readonly={!editar} />
    </div>
    <div class="col-span-7">
      <InputText label="Razão Social" name="razao_social" bind:value={$form.razao_social} error={$errors.razao_social} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-3">
      <InputMask mask="00.000.000/0000-00" label="CNPJ" name="cnpj" bind:value={$form.cnpj} error={$errors.cnpj} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-3">
      <InputText
        label="Código de Regime Tributário"
        name="codigo_regime_tributario"
        bind:value={$form.codigo_regime_tributario}
        error={$errors.codigo_regime_tributario}
        errorSpacing
        readonly={!editar}
      />
    </div>
    <div class="col-span-4">
      <InputText label="Inscrição Estadual" name="inscricao_estadual" bind:value={$form.inscricao_estadual} error={$errors.inscricao_estadual} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-2">
      <InputText label="País" name="pais" bind:value={$form.pais} error={$errors.pais} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-1">
      <InputText label="UF" name="uf" bind:value={$form.uf} error={$errors.uf} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-3">
      <InputText label="Município" name="municipio" bind:value={$form.municipio} error={$errors.municipio} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-4">
      <InputText label="Bairro" name="bairro" bind:value={$form.bairro} error={$errors.bairro} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-4">
      <InputMask mask="00000-000" label="CEP" name="cep" bind:value={$form.cep} error={$errors.cep} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-8">
      <InputText label="Endereço" name="endereco" bind:value={$form.endereco} error={$errors.endereco} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-4">
      <InputMask mask="(00)00000-0000" label="Telefone" name="telefone" bind:value={$form.telefone} error={$errors.telefone} errorSpacing readonly={!editar} />
    </div>
    <div class="col-span-12 place-self-center gap-2">
      {#if $formId == 'criar'}
        <button formaction="?/cadastrar" type="submit" class="btn variant-filled-primary">Cadastrar</button>
      {:else if editar}
        <button formaction="?/editar" name="id" value={$form.id} type="submit" class="btn variant-filled-primary">Salvar</button>
        <button type="reset" class="btn variant-filled-secondary" on:click={onCancelar}>Cancelar Edição</button>
      {/if}
    </div>
    <div class="col-span-12 justify-self-center">
      <HelperMessage error={$message} />
    </div>
  </form>
</div>
