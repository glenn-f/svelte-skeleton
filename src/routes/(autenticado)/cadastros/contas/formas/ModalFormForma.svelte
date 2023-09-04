<script>
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputCheck from '$lib/components/Forms/InputCheck.svelte'
  import InputGroup from '$lib/components/Forms/InputGroup.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { formatMoeda } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { SlideToggle, getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  const modalStore = getModalStore()
  const toastStore = getToastStore()

  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = { taxa_encargo: 0, pode_receber: true, pode_parcelar: false }
  export let contas

  const { form, errors, enhance, message } = superForm(formData, {
    dataType: 'json',
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

  function addParcelamento() {
    if (!$form.parcelamentos) $form.parcelamentos = []
    if (tmp_parcela > 0 && Number.isFinite(tmp_taxa_encargo)) {
      const parcIndex = $form.parcelamentos.findIndex((v) => v.parcela == tmp_parcela)
      if (parcIndex === -1) {
        $form.parcelamentos = [...$form.parcelamentos, { taxa_encargo: tmp_taxa_encargo, parcela: tmp_parcela }].sort((a, b) => a.parcela - b.parcela)
      } else {
        $form.parcelamentos[parcIndex] = { taxa_encargo: tmp_taxa_encargo, parcela: tmp_parcela }
      }

      tmp_taxa_encargo = undefined
      tmp_parcela = tmp_parcela + 1
    }
  }
  function delParcelamento(index) {
    $form.parcelamentos = $form.parcelamentos.filter((v, i) => i !== index)
  }

  let action, titulo, input
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
    input.focus()
  })

  let tmp_parcela, tmp_taxa_encargo
</script>

<form {action} method="POST" use:enhance>
  <CardModal>
    <svelte:fragment slot="header">
      <h2 class="h2">{titulo} Forma de Transação</h2>
    </svelte:fragment>
    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-3">
        <InputSelect
          label="Conta"
          name="conta_id"
          bind:value={$form.conta_id}
          options={contas}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.nome}
          getDisabled={(option) => Boolean(option.delecao)}
          error={$errors.conta_id}
          errorSpacing
          required
        />
      </div>
      <div class="col-span-5">
        <InputText bind:input label="Nome da Forma" placeholder="Ex: Débito, Crédito" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <div class="col-span-4 place-self-center">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label flex align-middle gap-2">
          <SlideToggle active="bg-primary-active-token" name="pode_parcelar" bind:checked={$form.pode_parcelar} />
          <span>Parcelável</span>
        </label>
      </div>
      <div class="col-span-12">
        <InputGroup>
          <div class="flex gap-1" slot="label">Atribuições</div>
          <div class="grid grid-cols-2 whitespace-nowrap">
            <InputCheck label="Pode Receber" name="pode_receber" bind:checked={$form.pode_receber} />
            <InputCheck label="Pode Pagar" name="pode_pagar" bind:checked={$form.pode_pagar} />
          </div>
        </InputGroup>
      </div>
      {#if $form.pode_parcelar}
        <div class="col-span-4">
          <InputNumber label="Parcela" bind:value={tmp_parcela} />
        </div>
        <div class="col-span-5">
          <InputPercent label="Taxa de Encargo" bind:value={tmp_taxa_encargo} casasDecimais={2} onKeyEnter={() => addParcelamento()} />
        </div>
        <div class="col-span-3 self-end justify-self-center">
          <button type="button" class="btn variant-filled" on:click={addParcelamento}><Icon icon="fa6-solid:plus" />&nbsp;Parcela</button>
        </div>
        <div class="col-span-12 my-2">
          {#if $form.pode_parcelar && !($form.parcelamentos?.length > 0)}
            <aside class="alert variant-ghost-warning">
              <!-- Icon -->
              <div><Icon icon="mdi:alert" width="32px" height="32px" /></div>
              <!-- Message -->
              <div class="alert-message">
                <p>Você marcou esta forma de transação como <b>Parcelável</b>, insira pelo menos <u>um parcelamento</u>.</p>
              </div>
            </aside>
          {:else}
            <table class="table table-compact table-hover text-center">
              <thead>
                <tr>
                  <th class="text-center">Número da Parcela</th>
                  <th class="text-center">Taxa de Encargo</th>
                  <th class="text-center w-0">#</th>
                </tr>
              </thead>
              <tbody>
                {#each $form.parcelamentos || [] as _, i}
                  <tr>
                    <td>{$form.parcelamentos[i].parcela}</td>
                    <td>{formatMoeda($form.parcelamentos[i].taxa_encargo * 100)}%</td>
                    <td>
                      <button on:click={() => delParcelamento(i)} type="button" class="text-error-500"><Icon icon="fa6-solid:trash" /></button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.parcelamentos?._errors} />
        </div>
      {:else}
        <div class="col-span-12">
          <InputPercent label="Taxa de Encargo" placeholder="Ex: 8,75" name="taxa_encargo" casasDecimais={2} bind:value={$form.taxa_encargo} error={$errors.taxa_encargo} errorSpacing required />
        </div>
      {/if}
      <!-- <div class="col-span-12">
        <SuperDebug data={$form} />
      </div> -->
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
