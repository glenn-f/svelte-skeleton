<script>
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'; const modalStore = getModalStore(); const toastStore = getToastStore();
  import { superForm } from 'sveltekit-superforms/client'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import { onMount } from 'svelte'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = {}
  export let data
  $: ({ categorias, regrasComissao, regrasTributo } = data ?? {})
  const { form, errors, enhance, message } = superForm(formData, {
    dataType: 'json',
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

  let action, titulo
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
  }

  onMount(() => {
    $form = { ...initialData }
    $errors = {}
    $message = ''
  })
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Produto</h2>
    </svelte:fragment>
    <!-- <SuperDebug data={$form} /> -->
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="class col-span-12">
        <InputSelect
          name="produto_categoria_id"
          label="Categoria"
          options={categorias}
          getDisabled={(v) => Boolean(v.delecao)}
          getOptionLabel={(v) => v.nome}
          getOptionValue={(v) => v.id}
          bind:value={$form.produto_categoria_id}
        />
      </div>
      <div class="col-span-12">
        <InputText label="Nome" placeholder="Ex: Iphone 20 Ultra Pro 1TB" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <div class="col-span-12">
        <InputText label="Tipo de Identificação Única" placeholder="Ex: IMEI, Serial Number" name="titulo_codigo" bind:value={$form.titulo_codigo} error={$errors.titulo_codigo} errorSpacing />
      </div>
      <div class="col-span-6">
        <InputSelect
          options={regrasTributo}
          getOptionLabel="nome"
          getOptionValue="id"
          getDisabled={(v) => !!v.delecao}
          label="Regra de Tributação"
          placeholder="Selecione..."
          placeholderEnabled
          name="regra_tributo_id"
          bind:value={$form.regra_tributo_id}
          error={$errors.regra_tributo_id}
        />
        {#if $form.regra_tributo_id}
          {@const regra = regrasTributo.find((v) => v.id == $form.regra_tributo_id) || {}}
          <div class="w-full ml-3 text-sm my-2">
            <b>Descrição:</b>
            {regra.descricao || '-'} <br />
            <b>Taxa:</b>
            {formatTaxa(regra.taxa_fixa)}%
          </div>
        {/if}
      </div>
      <div class="col-span-6">
        <InputSelect
          options={regrasComissao}
          getOptionLabel="nome"
          getOptionValue="id"
          getDisabled={(v) => !!v.delecao}
          label="Regra de Comissão"
          placeholder="Selecione..."
          placeholderEnabled
          name="regra_comissao_id"
          bind:value={$form.regra_comissao_id}
          error={$errors.regra_comissao_id}
        />
        {#if $form.regra_comissao_id}
          {@const regra = regrasComissao.find((v) => v.id == $form.regra_comissao_id) || {}}
          <div class="w-full ml-3 text-sm my-2">
            <b>Descrição:</b>
            {regra.descricao || '-'} <br />
            <b>Taxa:</b>
            {formatTaxa(regra.taxa_fixa)}% +
            <b>Bônus:</b>
            R$ {formatMoeda(regra.bonus_fixo)}
          </div>
        {/if}
      </div>
      <!-- <div class="col-span-12">
        <SuperDebug data={{ $form }} />
      </div> -->
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        {#if modo == 'editar'}
          <input type="hidden" name="id" value={initialData.id} />
        {/if}
        <button type="submit" class="btn variant-filled-primary">Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
