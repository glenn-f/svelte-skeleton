<script>
  import InputDateTime from '$lib/components/Forms/InputDateTime.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { FCC_CUSTO, mapCondicao, mapEstadoEstoque, mapFluxoContabil, mapFluxoContabilClasse, mapFluxoEstoque, mapOrigem, mapProcessoEstoque } from '$lib/globals.js'
  import { formatDateTime, formatMoeda } from '$lib/helpers.js'
  import { fade } from 'svelte/transition'
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import ExternalLinkIcon from '$lib/components/ExternalLinkIcon.svelte'
  import InputGroup from '$lib/components/Forms/InputGroup.svelte'
  import IconButton from '$lib/components/IconButton.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  export let data

  $: estoque = data.estoque || {}
</script>

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/inventario">Inventário</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Ver Detalhes</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center">
      <h3 class="h3 text-center mr-3">Descrição do Item</h3>
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
      <!-- TODO colocar em Processos e Lançamentos
         <div class="lg:col-span-2">
        <ShowBox label="Usuário que Inseriu">
          {estoque.criador}
          <ExternalLinkIcon href={`/cadastros/usuarios/${estoque.criador_id}`} />
        </ShowBox>
      </div> -->
      <div class="col-span-4 lg:col-span-3">
        <ShowBox label="Estado Atual">
          {mapEstadoEstoque.get(estoque.estado)}
        </ShowBox>
      </div>
      <div class="col-span-2 lg:col-span-1">
        <ShowBox label="Quantidade">{estoque.qntd}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-2">
        <ShowBox label="Custo Unitário">{formatMoeda(estoque.custo / estoque.qntd)}</ShowBox>
      </div>
      <div class="col-span-3 lg:col-span-2">
        <ShowBox label="Preço de Venda Unitário">{formatMoeda(estoque.preco_unitario) || '-'}</ShowBox>
      </div>
      <div class="col-span-6 lg:col-span-2">
        <ShowBox label="Data de Criação">{formatDateTime(estoque.criacao)}</ShowBox>
      </div>
      <div class="col-span-6 lg:col-span-2">
        <ShowBox label="Data de Deleção">{formatDateTime(estoque.delecao) || '-'}</ShowBox>
      </div>
      {#if estoque.observacoes}
        <div class="col-span-12">
          <ShowBox label="Observações">{estoque.observacoes}</ShowBox>
        </div>
      {/if}
      <div class="col-span-12 flex items-center justify-center flex-wrap gap-2">
        <Button
          href={`/loja/vender?eid=${estoque.id}`}
          text="Iniciar Venda"
          data-tooltip="Iniciar a venda deste item (saída de estoque)"
          class="variant-filled-primary"
          icon="mdi:point-of-sale"
          disabled
        />
        <Button
          href={`/estoque/saidas/adicionar?eid=${estoque.id}`}
          text="Iniciar Saída"
          data-tooltip="Iniciar saída de estoque deste item (venda ou perda)"
          class="variant-filled"
          icon="ri:inbox-unarchive-fill"
          disabled
        />
        <Button
          on:click={() => alert('TODO: modal para lançamentos')}
          text="Lançamentos"
          data-tooltip="Efetuar lançamentos de custos e receitas"
          class="variant-filled-secondary"
          icon="fa6-solid:plus"
        />
        <Button
          on:click={() => alert('TODO: modal para edição de dados do item \n(código, origem, condicao, estado, preço, observacoes)')}
          text="Editar Item"
          data-tooltip="Editar a descrição do item, o estado e preço de venda"
          class="variant-filled-tertiary"
          icon="fa6-solid:pen-to-square"
        />
      </div>
      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Processos de Estoque</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover whitespace-nowrap text-center">
          <thead>
            <tr class="!text-center">
              <th class="w-0" />
              <th class="w-0">Data Processo</th>
              <th>Processo</th>
              <th>Fluxo</th>
              <th>Observações</th>
              <th class="w-0">Variação de Estoque</th>
              <th class="w-0">Lançamentos</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each estoque.pes ?? [] as { pe_id, tipo_pe, criacao, tipo_fe, qntd, fe_observacoes, contabil, hidden }, i}
              <tr>
                <td>
                  <button
                    type="button"
                    class="transition-all duration-150"
                    class:rotate-90={!hidden}
                    class:text-primary-500-400-token={!hidden}
                    on:click={() => (estoque.pes[i].hidden = !estoque.pes[i].hidden)}
                  >
                    <Icon icon="fa6-solid:chevron-right" />
                  </button>
                </td>
                <td class="!whitespace-nowrap">{formatDateTime(criacao)}</td>
                <td>{mapProcessoEstoque.get(tipo_pe)}</td>
                <td>{mapFluxoEstoque.get(tipo_fe)}</td>
                <td>{fe_observacoes ?? ''}</td>
                <td class="flex gap-1 justify-center items-center" class:text-green-500={qntd > 0} class:text-red-500={qntd < 0}>
                  {#if qntd > 0}
                    <Icon icon="fa6-solid:plus" />
                  {:else if qntd < 0}
                    <Icon icon="fa6-solid:minus" />
                  {/if}
                  {qntd}
                </td>
                <td>{formatMoeda(contabil.reduce((acc, { valor, classe_fc }) => acc + valor * (classe_fc == FCC_CUSTO ? -1 : 1), 0))}</td>
                <td class="flex gap-1">
                  <ExternalLinkIcon href={`/estoque/entradas/${pe_id}`} data-tooltip="Abrir" />
                </td>
              </tr>
              {#if contabil?.length > 0}
                <td colspan="100" class="!p-0 transition-all" class:hidden>
                  <div class="grid grid-cols-12 bg-surface-200-700-token">
                    <div class="col-span-1 grid place-content-center text-center">
                      <!-- <Icon icon="mdi:chevron-down-box" width="32px" height="32px" class="text-tertiary-500" /> -->
                      <small class="font-bold">Lançamentos<br />Contábeis</small>
                    </div>
                    <div class="col-span-11 table-container border border-surface-400 !rounded-none">
                      <table class="table table-compact text-center !rounded-none">
                        <thead>
                          <tr class="!text-center">
                            <td />
                            <th class="!py-1">Classe</th>
                            <th class="!py-1">Tipo</th>
                            <th class="!py-1">Observações</th>
                            <th class="!py-1">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each contabil ?? [] as { classe_fc, tipo_fc, valor, fc_observacoes }, j}
                            <tr>
                              <td />
                              <td>{mapFluxoContabilClasse.get(classe_fc)}</td>
                              <td>{mapFluxoContabil.get(tipo_fc)}</td>
                              <td>{fc_observacoes ?? ''}</td>
                              <td>{formatMoeda(valor * (classe_fc == FCC_CUSTO ? -1 : 1))}</td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
      <!-- <div class="col-span-12">
        <SuperDebug data={estoque} />
      </div> -->
    </div>
  </div>
</div>
