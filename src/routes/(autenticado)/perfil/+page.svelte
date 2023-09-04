<script>
  import Icon from '@iconify/svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import ModalFormSenha from './ModalFormSenha.svelte'
  import { invalidateAll } from '$app/navigation'
  export let data
  const modalStore = getModalStore()
  const toastStore = getToastStore()

  $: ({
    form: usuario,
    errors,
    enhance,
    message,
    reset
  } = superForm(data.formEditar, {
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
        // invalidateAll()
        editar = false
        result.data.form.message = ''
      }
    }
  }))

  const superFormAlterarSenha = superForm(data.formAlterarSenha, {
    invalidateAll: true,
    resetForm: true,
    taintedMessage: false,
    onResult: async ({ result }) => {
      const message = result.data.form.message
      if (result.type == 'success') {
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        invalidateAll()
        result.data.form.message = ''
        modalStore.close()
      }
    }
  })

  let editar = false
  let inputNome

  function onAlterarSenha() {
    modalStore.trigger({ type: 'component', component: { ref: ModalFormSenha, props: { superForm: superFormAlterarSenha } } })
  }
  function onEditar() {
    editar = !editar
    if (!editar) reset()
    else inputNome.focus()
  }
</script>

<div class="grid grid-cols-12 gap-2">
  <div class="col-span-12 flex gap-2">
    <button class="btn variant-filled flex gap-1" on:click={onEditar} disabled={editar}>
      <Icon icon="fa6-solid:pen-to-square" />
      Editar Dados
    </button>
    <button class="btn variant-filled flex gap-1" on:click={onAlterarSenha}><Icon icon="fa6-solid:lock" />Alterar Senha</button>
  </div>
  <form use:enhance action="?/editar" method="post" class="card grid grid-cols-12 col-span-12 p-2 gap-2 bg-surface-300-600-token">
    <div class="md:col-span-6 col-span-12">
      <InputText bind:input={inputNome} error={$errors.nome} label="Nome Completo" name="nome" bind:value={$usuario.nome} readonly={editar == false} required />
    </div>
    <div class="md:col-span-6 col-span-12">
      <InputText error={$errors.email} label="E-mail" name="email" bind:value={$usuario.email} readonly={editar == false} required />
    </div>
    {#if editar}
      <div class="col-span-12 flex gap-2 justify-center mt-2">
        <button type="submit" class="btn variant-filled-primary flex gap-1">
          <Icon icon="fa6-solid:check" />
          Salvar Dados
        </button>
        <button type="reset" class="btn variant-filled-secondary flex gap-1" on:click={onEditar}>
          <Icon icon="fa6-solid:xmark" />
          Cancelar Edição
        </button>
      </div>
      <div class="col-span-12 justify-self-center">
        <HelperMessage error={$message} />
      </div>
    {/if}
  </form>
</div>
