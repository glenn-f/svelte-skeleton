<script>
  import CardModal from '$lib/components/CardModal.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { EE_DISPONIVEL, mapEstadoEstoque } from '$lib/globals'
  import { formatMoeda, formatTaxa } from '$lib/helpers'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'; const modalStore = getModalStore(); const toastStore = getToastStore();
  import { superForm } from 'sveltekit-superforms/client'
  export let data, formData
  $: regrasTributo = data.regrasTributo
  $: regrasComissao = data.regrasComissao

  const { form, errors, enhance, message } = superForm(formData, {
    dataType: 'json',
    invalidateAll: true,
    taintedMessage: false,
    onResult: async ({ result }) => {
      const message = result.data?.form?.message
      if (result.type == 'success') {
        if (message) {
          toastStore.trigger({
            message,
            timeout: 5000,
            hoverable: true,
            background: 'variant-filled-success'
          })
        }
        modalStore.close()
      }
    }
  })
  $form.regra_tributo_id = $form.regra_tributo_id ?? undefined
  $form.regra_comissao_id = $form.regra_comissao_id ?? undefined
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Editar Item</h2>
  </svelte:fragment>
  <form id="formEditarItem" action="?/editarItem" method="POST" class="grid grid-cols-12 gap-1 px-3" use:enhance>
    <div class="col-span-12 grid grid-cols-12 gap-2">
      <h4 class="h4 col-span-12">
        Configurações para Venda <hr />
      </h4>
      <div class="col-span-6">
        <InputSelect label="Estado Inicial" bind:value={$form.estado} error={$errors.estado} options={mapEstadoEstoque} required />
      </div>
      <div class="col-span-6">
        <InputMoeda label="Preço Unitário" bind:value={$form.preco_unitario} required={$form.estado === EE_DISPONIVEL} error={$errors.preco_unitario} />
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
      <div class="col-span-12">
        <InputText label="Observações" bind:value={$form.observacoes} error={$errors.observacoes} />
      </div>
    </div>
    <!-- <div class="col-span-12">
      <SuperDebug data={item} />
    </div> -->
  </form>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      <button type="submit" form="formEditarItem" class="btn variant-filled-primary">Salvar</button>
      <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
