<script>
  import ExternalLinkIcon from '$lib/components/ExternalLinkIcon.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import {
    PE_PERDA,
    PE_VENDA_COM_BUYBACK,
    getClasseContabil,
    isCusto,
    isReceita,
    mapCondicao,
    mapFluxoContabil,
    mapFluxoEstoque,
    mapFluxoFinanceiro,
    mapOrigem,
    mapProcessoEstoque
  } from '$lib/globals.js'
  import { formatDateTime, formatTaxa, resumirProcesso } from '$lib/helpers.js'
  import Icon from '@iconify/svelte'
  import { CodeBlock, getModalStore } from '@skeletonlabs/skeleton'
  import VariacaoNumero from '../../../../../lib/components/VariacaoNumero.svelte'
  import ModalEstornar from './ModalEstornar.svelte'
  import TabelaComissoes from './TabelaComissoes.svelte'
  import TabelaTributos from './TabelaTributos.svelte'
  import ModalAlterarVendedor from './ModalAlterarVendedor.svelte'
  export let data

  $: colaboradores = data.colaboradores || []
  $: saida = data.entrada || {}
  $: totalQntdEstoque = saida.fe?.reduce((acc, { var_qntd }) => acc + var_qntd, 0)
  $: totalCustoEstoque = saida.fe?.reduce((acc, { var_custo }) => acc + var_custo, 0)
  $: totalTransacoes = saida.ff?.reduce((acc, { valor }) => acc + valor, 0)
  $: totalEncargos = saida.ff?.reduce((acc, { encargo_valor }) => acc + (encargo_valor || 0), 0)
  $: totalOutrosLancamentos = saida.fc?.reduce((acc, { valor }) => acc + valor, 0)
  $: totalCustos = saida.fc?.reduce((acc, { valor, tipo_fc }) => acc + (isCusto(tipo_fc) ? valor : 0), 0)
  $: totalReceitas = saida.fc?.reduce((acc, { valor, tipo_fc }) => acc + (isReceita(tipo_fc) ? valor : 0), 0)
  $: varTransacoes = totalTransacoes + totalEncargos
  $: varPatrimonio = totalCustoEstoque + varTransacoes
  $: resultadoContabil = totalCustos + totalReceitas
  $: console.log({ totalOutrosLancamentos, totalEncargos })
  //TODO somar custo rateado do estoque (valor lançamento = custo aquisicao, outros lançamentos = lançamentos rateados, total lancamentos = custo + outros )

  const modalStore = getModalStore()
  function abrirIniciarEstorno() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalEstornar, props: { data: saida } }
    })
  }
  function abrirAlterarVendedor() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalAlterarVendedor, props: { data: { formData: data.formData, saida, colaboradores } } }
    })
  }
</script>

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/saidas">Saídas</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Ver Detalhes</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center">
      <h3 class="h3 text-center mr-3">Detalhes do Processo</h3>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-4">
        <ShowBox label="Processo de Estoque">
          {mapProcessoEstoque.get(saida.tipo_pe)}
        </ShowBox>
      </div>
      <div class="col-span-4">
        <ShowBox label="Usuário Criador">
          {#if saida.criador}
            {saida.criador}
            <ExternalLinkIcon href={`/cadastros/usuarios/${saida.criador_id}`} data-tooltip="Abrir Detalhes do Usuário" />
          {:else}
            -
          {/if}
        </ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Data de Criação">{formatDateTime(saida.criacao)}</ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Data de Deleção">{formatDateTime(saida.delecao) || '-'}</ShowBox>
      </div>
      <div class="col-span-3">
        <ShowBox label="Responsável">
          {#if saida.responsavel}
            {saida.responsavel}
            <ExternalLinkIcon href={`/cadastros/pessoas/${saida.responsavel_id}`} data-tooltip="Abrir Detalhes da Pessoa" />
          {:else}
            -
          {/if}
        </ShowBox>
      </div>
      {#if saida.tipo_pe !== PE_PERDA}
        <div class="col-span-3">
          <ShowBox label="Cliente">
            {#if saida.participante}
              {saida.participante}
              <ExternalLinkIcon href={`/cadastros/pessoas/${saida.participante_id}`} data-tooltip="Abrir Detalhes da Pessoa" />
            {:else}
              -
            {/if}
          </ShowBox>
        </div>
        <div class="col-span-2">
          <ShowBox label="Variação Saldo Contas">
            <VariacaoNumero value={varTransacoes} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-2">
          <ShowBox label="Variação Valor Estoque">
            <VariacaoNumero value={totalCustoEstoque} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-2">
          <ShowBox label="Variação Patrimonial">
            <VariacaoNumero value={varPatrimonio} type="currency" />
          </ShowBox>
        </div>

        <div class="col-span-6" />
        <div class="col-span-2">
          <ShowBox label="Custo Total">
            <VariacaoNumero value={totalCustos} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-2">
          <ShowBox label="Receita Total">
            <VariacaoNumero value={totalReceitas} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-2">
          <ShowBox label="Resultado Contábil">
            <VariacaoNumero value={resultadoContabil} type="currency" />
          </ShowBox>
        </div>
      {:else}
        <div class="col-span-3">
          <ShowBox label="Variação Saldo Contas">
            <VariacaoNumero value={varTransacoes} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-3">
          <ShowBox label="Variação Valor Estoque">
            <VariacaoNumero value={totalCustoEstoque} type="currency" />
          </ShowBox>
        </div>
        <div class="col-span-3">
          <ShowBox label="Variação Patrimonial">
            <VariacaoNumero value={varPatrimonio} type="currency" />
          </ShowBox>
        </div>
      {/if}
      {#if saida.observacoes}
        <div class="col-span-12">
          <ShowBox label="Observações">{saida.observacoes}</ShowBox>
        </div>
      {/if}
      <div class="col-span-12 flex items-center justify-center flex-wrap gap-2">
        <Button on:click={() => abrirAlterarVendedor()} text="Trocar Vendedor" class="variant-filled-primary" icon="fa6-solid:rotate" />
        <!-- <Button on:click={() => abrirIniciarEstorno()} text="Iniciar Estorno" data-tooltip="Efetuar estorno parcial ou total do processo" class="variant-filled-error" icon="fa-solid:undo-alt" /> -->
        <Button
          on:click={() => alert('TODO: modal ou página para edição do processo \n(responsavel, participante, observacoes)\n+estoques, transações, lançamentos')}
          text="Editar Processo"
          data-tooltip="Editar o processo, estoques, transações e lançamentos"
          class="variant-filled-tertiary"
          disabled
          icon="fa6-solid:pen-to-square"
        />
        {#if saida.tipo_pe == PE_VENDA_COM_BUYBACK}
          <Button
            href={`/estoque/saidas/${saida.id}/reciboBuyback`}
            target="_blank"
            text="Recibo de Buyback"
            data-tooltip="Recibo resumido do Buyback"
            class="variant-ghost-success dark:text-white text-black"
            icon="fa6-solid:receipt"
          />
        {/if}
      </div>
      <div class="col-span-12 grid grid-cols-3">
        <div class="col-span-1" />
        <div class="col-span-1">
          <CodeBlock code={resumirProcesso(saida)} shadow="shadow-xl" buttonLabel="Copiar" language={`Resumo da ${mapProcessoEstoque.get(saida.tipo_pe)}`} />
        </div>
        <div class="col-span-1" />
      </div>
      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Fluxo de Estoque</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th class="w-0">EID</th>
              <th class="w-0">Fluxo Estoque</th>
              <th>Responsável</th>
              <th>Origem</th>
              <th>Condição</th>
              <th>Produto</th>
              <th>Código</th>
              <th>Observações</th>
              <!-- <th>Fluxo Contábil</th> -->
              <th class="w-0">Qntd Estoque</th>
              <th class="w-0">Valor Estoque</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each saida.fe ?? [] as fluxo, i}
              <tr class="!whitespace-nowrap">
                <td>{fluxo.estoque_id}</td>
                <td>{mapFluxoEstoque.get(fluxo.tipo_fe)}</td>
                <td>
                  <div class="flex gap-1 items-center justify-center">
                    {fluxo.responsavel ?? '-'}
                    {#if fluxo.responsavel}
                      <ExternalLinkIcon href={`/estoque/pessoas/${fluxo.responsavel_id}`} data-tooltip="Abrir Detalhes do Responsável" data-placement="top" />
                    {/if}
                  </div>
                </td>
                <td>{mapOrigem.get(fluxo.origem)}</td>
                <td>{mapCondicao.get(fluxo.condicao)}</td>
                <td>
                  <div class="flex gap-1 items-center justify-center">
                    {fluxo.produto}
                    <ExternalLinkIcon href={`/cadastros/produtos/${fluxo.produto_id}`} data-tooltip="Abrir Cadastro do Produto" data-placement="top" />
                  </div>
                </td>
                <td>{fluxo.codigo ?? ''}</td>
                <td>{fluxo.observacoes ?? ''}</td>
                <!-- <td>{mapFluxoContabil.get(fluxo.tipo_fc) ?? ''}</td> -->
                <td><VariacaoNumero value={fluxo.var_qntd} /></td>
                <td><VariacaoNumero value={fluxo.var_custo} type="currency" /></td>
                <td class="flex gap-1">
                  <ExternalLinkIcon href={`/estoque/inventario/${fluxo.estoque_id}`} data-tooltip="Abrir Detalhes do Estoque" data-placement="left" />
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="7" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalQntdEstoque} /></td>
              <td><VariacaoNumero value={totalCustoEstoque} type="currency" /></td>
              <td colspan="100" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Transações</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center">
          <thead>
            <tr class="!text-center whitespace-nowrap">
              <th class="w-0">Fluxo Financeiro</th>
              <th>Conta</th>
              <th>Forma Transação</th>
              <th class="w-0">Taxa Encargo</th>
              <th class="w-0">Valor</th>
              <th class="w-0" data-tooltip="O Valor do Encargo é um lançamento contábil" data-placement="left"> Valor Encargo </th>
              <th class="w-0">Balanço Conta</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each saida.ff ?? [] as fluxo, i}
              <tr class="!whitespace-nowrap">
                <td>{mapFluxoFinanceiro.get(fluxo.tipo_ff)}</td>
                <td>
                  <div class="flex gap-1 items-center justify-center whitespace-nowrap">
                    {fluxo.conta}
                    <ExternalLinkIcon href={`/cadastros/contas/${fluxo.conta_id}`} data-tooltip="Abrir Cadastro da Conta" data-placement="right" />
                  </div>
                </td>
                <td>
                  <div class="flex gap-1 items-center justify-center whitespace-nowrap">
                    {fluxo.conta_forma + (fluxo.parcela > 0 ? ` ${fluxo.parcela}x` : '')}
                    <ExternalLinkIcon href={`/cadastros/contas/formas/${fluxo.conta_forma_id}`} data-tooltip="Abrir Cadastro da Forma de Transação" data-placement="top" />
                  </div>
                </td>
                <td>{formatTaxa(fluxo.taxa_encargo)}%</td>
                <td><VariacaoNumero value={fluxo.valor} type="currency" /></td>
                <td><VariacaoNumero value={fluxo.encargo_valor} type="currency" /></td>
                <td><VariacaoNumero value={fluxo.valor + (fluxo.encargo_valor ?? 0)} type="currency" /></td>
                <td class="flex gap-1">
                  <ExternalLinkIcon href={`/transacoes/historico/${fluxo.id}`} data-tooltip="Abrir Detalhes da Transação" data-placement="left" />
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="100">Nenhuma transação foi encontrada</td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="3" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalTransacoes} type="currency" /></td>
              <td><VariacaoNumero value={totalEncargos} type="currency" /></td>
              <td><VariacaoNumero value={varTransacoes} type="currency" /></td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <TabelaTributos {data} />

      <TabelaComissoes {data} />

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Lançamentos Contábeis por Estoque</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th class="w-0">EID</th>
              <th>Fluxo Contábil</th>
              <th>Classe</th>
              <th>Produto</th>
              <th>Observações</th>
              <th class="w-0">Valor Lançamento</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each saida?.fc ?? [] as { produto, estoque_id, tipo_fc, valor, observacoes }, j}
              <tr>
                <td class="!whitespace-nowrap">{estoque_id}</td>
                <td class="!whitespace-nowrap">{mapFluxoContabil.get(tipo_fc)}</td>
                <td class="!whitespace-nowrap">{getClasseContabil(tipo_fc)}</td>
                <td class="!whitespace-nowrap">{produto}</td>
                <td>{observacoes ?? ''}</td>
                <td><VariacaoNumero value={valor} type="currency" /></td>
                <td class="w-0" />
              </tr>
            {:else}
              <tr>
                <td colspan="100">Nenhum lançamento foi encontrado</td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="4" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalOutrosLancamentos} type="currency" /></td>
              <td colspan="100" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Lançamentos Contábeis do Processo</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th>Fluxo Contábil</th>
              <th>Classe</th>
              <th>Observações</th>
              <th class="w-0">Valor Lançamento</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each saida?.fcg ?? [] as { tipo_fc, valor, observacoes }, j}
              <tr>
                <td class="!whitespace-nowrap">{mapFluxoContabil.get(tipo_fc)}</td>
                <td class="!whitespace-nowrap">{getClasseContabil(tipo_fc)}</td>
                <td>{observacoes ?? ''}</td>
                <td><VariacaoNumero value={valor} type="currency" /></td>
                <td class="w-0" />
              </tr>
            {:else}
              <tr>
                <td colspan="100">Nenhum lançamento foi encontrado</td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="2" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalOutrosLancamentos} type="currency" /></td>
              <td colspan="100" />
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- <div class="col-span-12">
        <SuperDebug data={entrada} />
      </div> -->
    </div>
  </div>
</div>
