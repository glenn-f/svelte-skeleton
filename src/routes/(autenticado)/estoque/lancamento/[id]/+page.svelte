<script>
  import { triggerMessage } from '$lib/client'
  import ExternalLinkIcon from '$lib/components/ExternalLinkIcon.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { mapCondicao, mapEstadoEstoque, mapFluxoContabil, mapOrigem } from '$lib/globals.js'
  import { formatMoeda, formatTaxa, roundBy } from '$lib/helpers.js'
  import Icon from '@iconify/svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { superForm } from 'sveltekit-superforms/client'
  import ModalLancamento from '../../lancamento/[id]/ModalLancamento.svelte'
  import ModalPgto from './ModalPgto.svelte'
  import { goto } from '$app/navigation'
  import InputSelect from '$lib/components/Forms/InputSelect.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data, inputForm
  const toastStore = getToastStore()
  const modalStore = getModalStore()
  const { form, errors, enhance, submitting } = superForm(data.form, {
    dataType: 'json',
    taintedMessage: false,
    resetForm: true,
    onResult: async (event) => {
      triggerMessage(event, toastStore)
      if (event.result.type == 'success') {
        const id = event.result.data.form.data
        await goto(`/estoque/inventario/${estoque.id}`, { invalidateAll: true })
      }
    }
  })

  $: formas = data.formas || []
  $: colaboradores = data.colaboradores || []
  $: estoque = data.estoque || {}
  $: mapFormas = formasMap(formas)
  $: totalTransacoes = roundBy($form.transacoes?.reduce((acc, e) => e.valor + acc, 0) ?? 0, 2)
  $: totalLancamentos = roundBy($form.contabil?.reduce((acc, e) => e.valor + acc, 0) ?? 0, 2)
  $: totalFinal = roundBy(totalTransacoes + totalLancamentos, 2)
  $: regraComissao = data?.regrasComissao?.find((v) => v.id == data?.estoque?.regra_comissao_id)
  $: regraTributacao = data?.regrasTributo?.find((v) => v.id == data?.estoque?.regra_tributo_id)
  $: rc_text = regraComissao ? `${regraComissao.nome}: ${regraComissao.descricao} (Taxa: ${formatTaxa(regraComissao.taxa_fixa)}% + Bônus: ${formatMoeda(regraComissao.bonus_fixo)})` : '-'
  $: rt_text = regraTributacao ? `${regraTributacao.nome}: ${regraTributacao.descricao} (Taxa: ${formatTaxa(regraTributacao.taxa_fixa)}%)` : '-'
  $: fimMsg = totalFinal < 0 ? `Falta adicionar ${formatMoeda(-totalFinal)} em transações` : totalFinal > 0 ? `Adicione ${formatMoeda(totalFinal)} em lançamentos` : ''

  function abrirModalContabil() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalLancamento, props: { store: form } }
    })
  }
  function abrirModalPgto() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalPgto, props: { store: form, formas, totalFinal: -totalFinal } }
    })
  }
  function apagarPgto(index) {
    $form.transacoes = $form.transacoes.filter((o, i) => i !== index)
  }
  function apagarContabil(index) {
    $form.contabil = $form.contabil.filter((o, i) => i !== index)
  }
  function abrirModalConfirmacao() {
    modalStore.trigger({
      type: 'confirm',
      title: 'Confirmar Operação',
      body: 'Tem certeza que deseja continuar?',
      buttonTextCancel: 'Cancelar',
      buttonTextConfirm: 'Confirmar',
      modalClasses: 'h-min',
      response: (confirmado) => (confirmado ? inputForm.requestSubmit() : 0)
    })
  }
  function formasMap(formas) {
    const mapa = new Map()
    for (let i = 0; i < formas?.length; i++) {
      const f = formas[i]
      if (f.parcelamentos) {
        f.parcelamentos.forEach((p) => mapa.set(p.forma_transacao_id, { conta: f.conta, forma_completa: `${f.forma} ${p.parcela}x` }))
      } else {
        mapa.set(f.forma_transacao_id, { conta: f.conta, forma_completa: f.forma })
      }
    }
    return mapa
  }
</script>

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/inventario">Inventário</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href={`/estoque/inventario/${estoque.id}`}>Ver Detalhes</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Novo Lançamento</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center">
      <h3 class="h3 text-center mr-3">Descrição do Estoque</h3>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-6 lg:col-span-2">
        <ShowBox label="Categoria">
          {estoque.categoria || '-'}
          {#if estoque.categoria_id}
            <ExternalLinkIcon data-tooltip="Abrir Categoria" href={`/cadastros/produtos/categorias/${estoque.categoria_id}`} />
          {/if}
        </ShowBox>
      </div>
      <div class="col-span-6 lg:col-span-3">
        <ShowBox label="Nome do Produto">
          {estoque.produto_nome}
          <ExternalLinkIcon data-tooltip="Abrir Produto" href={`/cadastros/produtos/${estoque.produto_id}`} />
        </ShowBox>
      </div>
      <div class="col-span-6 lg:col-span-3">
        <ShowBox label={'Código' + (estoque.titulo_codigo ? ` (${estoque.titulo_codigo})` : '')}>{estoque.codigo || ''}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-2">
        <ShowBox label="Origem">{mapOrigem.get(estoque.origem)}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-2">
        <ShowBox label="Condição">{mapCondicao.get(estoque.condicao)}</ShowBox>
      </div>
      <div class="col-span-4 lg:col-span-3">
        <ShowBox label="Estado Atual">
          {mapEstadoEstoque.get(estoque.estado)}
        </ShowBox>
      </div>
      <div class="col-span-2 lg:col-span-1">
        <ShowBox label="Quantidade">{estoque.qntd}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-4">
        <ShowBox label="Custo Unitário">{formatMoeda(estoque.custo)}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-4">
        <ShowBox label="Preço de Venda Unitário">{formatMoeda(estoque.preco_unitario) || '-'}</ShowBox>
      </div>
      <!-- <div class="col-span-6 lg:col-span-2">
        <ShowBox label="Data de Deleção">{formatDateTime(estoque.delecao) || '-'}</ShowBox>
      </div> -->
      <div class="col-span-12">
        <ShowBox label="Observações">{estoque.observacoes ?? '-'}</ShowBox>
      </div>

      <div class="col-span-12">
        <div class="flex justify-center">
          <aside class="alert self-center variant-ghost-warning w-6/12 my-2">
            <div><Icon icon="fa6-solid:circle-info" width="32px" /></div>
            <div class="alert-message">
              <h3 class="h3">Lançamento e Transações</h3>
              <p>Efetue os lançamentos abaixo e coloque a contrapartida correspondente nas transações. A diferença entre lançamentos e transações deve ser igual a <b>zero</b>.</p>
            </div>
          </aside>
        </div>
      </div>
      <div class="col-span-9">
        <InputText placeholder="Digite aqui observações sobre estes lançamentos..." error={$errors.observacoes} label="Observações do Processo" bind:value={$form.observacoes} />
      </div>
      <div class="col-span-3">
        <InputSelect
          label="Colaborador Responsável"
          error={$errors.responsavel_id}
          placeholder="Selecione..."
          bind:value={$form.responsavel_id}
          options={colaboradores}
          getOptionLabel={(o) => o.nome}
          getOptionValue={(o) => o.id}
          getDisabled={(o) => !!o.delecao}
          placeholderEnabled
        />
      </div>
      <div class="groupbox col-span-12 grid grid-cols-12 place-content-start gap-2">
        <div class="col-span-12 flex justify-between items-center">
          <h4 class="h4 whitespace-nowrap">Novos Lançamentos</h4>
          <hr class="w-full mx-2 !border-primary-300-600-token" />
          <button type="button" class="btn btn-sm variant-filled" on:click={abrirModalContabil}>
            <Icon icon="fa6-solid:plus" />
            <span>Lançamento</span>
          </button>
        </div>

        <div class="col-span-12 table-container border border-surface-600">
          <table class="table table-compact table-hover text-center">
            <thead>
              <tr class="!text-center whitespace-nowrap">
                <th>Tipo</th>
                <th>Observações</th>
                <th>Valor Lançamento</th>
                <th class="w-0">#</th>
              </tr>
            </thead>
            <tbody>
              {#each $form.contabil ?? [] as { tipo_fc, valor, observacoes }, i}
                <tr>
                  <td>{mapFluxoContabil.get(tipo_fc)}</td>
                  <td class="max-w-[50ch] overflow-ellipsis overflow-hidden">{observacoes ?? ''}</td>
                  <td>{formatMoeda(-valor)}</td>
                  <td class="!whitespace-nowrap">
                    <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarContabil(i)}><Icon icon="fa6-solid:trash" /></button>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="100" class="variant-glass">Nenhum lançamento adicionado.</td>
                </tr>
              {/each}
            </tbody>
            <tfoot class="!variant-soft">
              <tr class="!text-center">
                <th colspan="2" class="text-right">Total</th>
                <td>{formatMoeda(-totalLancamentos)}</td>
                <td colspan="100" />
              </tr>
            </tfoot>
          </table>
          <div class="col-span-12 text-center">
            <HelperMessage error={$errors.contabil?._errors} />
          </div>
        </div>
      </div>

      <div class="groupbox col-span-12 grid grid-cols-12 place-content-start gap-2">
        <div class="col-span-12 flex justify-between items-center">
          <h4 class="h4 whitespace-nowrap">Novas Transações</h4>
          <hr class="w-full mx-2 !border-primary-300-600-token" />
          <button type="button" class="btn btn-sm variant-filled" on:click={abrirModalPgto}>
            <Icon icon="fa6-solid:plus" />
            <span>Pagamento</span>
          </button>
        </div>
        <div class="col-span-12">
          <!--* Tabela Pagamentos -->
          <table class="table table-compact table-hover text-center">
            <thead>
              <tr class="!text-center whitespace-nowrap">
                <th>Conta</th>
                <th>Forma de Transação</th>
                <th>Valor Pagamento</th>
                <th class="w-0">#</th>
              </tr>
            </thead>
            <tbody>
              {#each $form.transacoes ?? [] as { forma_transacao_id, valor }, i}
                {@const f = mapFormas.get(forma_transacao_id)}
                <tr>
                  <td>{f?.conta}</td>
                  <td>{f?.forma_completa}</td>
                  <td>{formatMoeda(valor || 0)}</td>
                  <td class="!whitespace-nowrap">
                    <button type="button" class="text-error-400 hover:text-error-600 transition-colors" on:click={() => apagarPgto(i)}><Icon icon="fa6-solid:trash" /></button>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="100" class="variant-glass">Nenhum pagamento adicionado.</td>
                </tr>
              {/each}
            </tbody>
            <tfoot class="!variant-soft">
              <tr class="!text-center">
                <th colspan="2" class="text-right">Total</th>
                <td>{formatMoeda(totalTransacoes)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="col-span-12 text-center">
          <HelperMessage error={$errors.transacoes?._errors} />
        </div>
      </div>

      <div class="col-span-12 text-center">
        <HelperMessage error={$errors._errors} />
      </div>
      <div class=" col-span-12 grid gap-2 justify-center">
        <HelperMessage message={fimMsg} type={totalFinal < 0 ? 'warning' : 'success'} />
        <form bind:this={inputForm} method="POST" use:enhance>
          <button
            type="submit"
            on:click|preventDefault={abrirModalConfirmacao}
            class="btn bg-gradient-to-br from-lime-500 to-orange-400 w-min"
            disabled={totalFinal !== 0 || $form.contabil.length === 0 || $submitting}
          >
            {#if $submitting}
              <Icon icon="line-md:loading-twotone-loop" width="24px" height="24px" />
              <p>Enviando...</p>
            {:else}
              <Icon icon="mdi:package-variant-closed-check" width="24px" height="24px" />
              <p>Finalizar</p>
            {/if}
          </button>
        </form>
      </div>
      <!-- <div class="col-span-12">
        <SuperDebug data={{ $form }} />
      </div> -->
    </div>
  </div>
</div>
