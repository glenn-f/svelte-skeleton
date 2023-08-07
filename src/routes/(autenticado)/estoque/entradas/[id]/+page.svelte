<script>
  import ExternalLinkIcon from '$lib/components/ExternalLinkIcon.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import { FCC_CUSTO, mapCondicao, mapFluxoContabil, mapFluxoContabilClasse, mapFluxoEstoque, mapFluxoFinanceiro, mapOrigem, mapProcessoEstoque } from '$lib/globals.js'
  import { formatDateTime, formatMoeda } from '$lib/helpers.js'
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  import VariacaoNumero from './VariacaoNumero.svelte'
  export let data

  $: entrada = data.entrada || {}
  $: totalVariacaoEstoque = entrada.fe?.reduce((acc, { qntd }) => acc + qntd, 0)
  $: totalCustoEstoque = entrada.fe?.reduce((acc, { custo }) => acc + custo, 0)
  $: totalTransacoes = entrada.ff?.reduce((acc, { valor }) => acc - valor, 0)
  $: totalEncargos = entrada.ff?.reduce((acc, { valor_encargo }) => acc - (valor_encargo || 0), 0)
  $: totalOutrosLancamentos = entrada.fc?.reduce((acc, { valor, classe_fc }) => acc + valor, 0)
  $: resultadoTransacoes = totalTransacoes + totalEncargos
  $: resultadoEstoque = totalCustoEstoque + totalEncargos + totalOutrosLancamentos
  $: resultadoContabil = resultadoTransacoes + resultadoEstoque
  //TODO somar custo rateado do estoque (valor lançamento = custo aquisicao, outros lançamentos = lançamentos rateados, total lancamentos = custo + outros )
</script>

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Estoque</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/estoque/entradas">Entradas</a></li>
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
          {mapProcessoEstoque.get(entrada.tipo_pe)}
        </ShowBox>
      </div>
      <div class="col-span-4">
        <ShowBox label="Usuário Criador">
          {#if entrada.criador}
            {entrada.criador}
            <ExternalLinkIcon href={`/cadastros/usuarios/${entrada.criador_id}`} data-tooltip="Abrir Detalhes do Usuário" />
          {:else}
            -
          {/if}
        </ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Data de Criação">{formatDateTime(entrada.criacao)}</ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Data de Deleção">{formatDateTime(entrada.delecao) || '-'}</ShowBox>
      </div>
      <div class="col-span-3">
        <ShowBox label="Responsável">
          {#if entrada.responsavel}
            {entrada.responsavel}
            <ExternalLinkIcon href={`/cadastros/pessoas/${entrada.responsavel_id}`} data-tooltip="Abrir Detalhes da Pessoa" />
          {:else}
            -
          {/if}
        </ShowBox>
      </div>
      <div class="col-span-3">
        <ShowBox label="Participante">
          {#if entrada.participante}
            {entrada.participante}
            <ExternalLinkIcon href={`/cadastros/pessoas/${entrada.participante_id}`} data-tooltip="Abrir Detalhes da Pessoa" />
          {:else}
            -
          {/if}
        </ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Variação Saldo Contas">
          <VariacaoNumero value={totalTransacoes} type="currency" />
        </ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Variação Valor Estoque">
          <VariacaoNumero value={resultadoEstoque} type="currency" />
        </ShowBox>
      </div>
      <div class="col-span-2">
        <ShowBox label="Resultado Contábil">
          <VariacaoNumero value={resultadoContabil} type="currency" />
        </ShowBox>
      </div>
      {#if entrada.observacoes}
        <div class="col-span-12">
          <ShowBox label="Observações">{entrada.observacoes}</ShowBox>
        </div>
      {/if}
      <div class="col-span-12 flex items-center justify-center flex-wrap gap-2">
        <Button
          on:click={() => alert('TODO: redirecionar para página de estorno de entrada')}
          text="Iniciar Estorno"
          data-tooltip="Efetuar estorno parcial ou total do processo"
          class="variant-filled-error"
          icon="fa-solid:undo-alt"
        />
        <Button
          on:click={() => alert('TODO: modal ou página para edição do processo \n(responsavel, participante, observacoes)\n+estoques, transações, lançamentos')}
          text="Editar Processo"
          data-tooltip="Editar o processo, estoques, transações e lançamentos"
          class="variant-filled-tertiary"
          icon="fa6-solid:pen-to-square"
        />
      </div>
      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Fluxo de Estoque</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th class="w-0">Fluxo Estoque</th>
              <th>Responsável</th>
              <th>Origem</th>
              <th>Condição</th>
              <th>Produto</th>
              <th>Código</th>
              <th>Observações</th>
              <!-- <th>Fluxo Contábil</th> -->
              <th class="w-0">Variação Estoque</th>
              <th class="w-0" data-placement="left" data-tooltip="O Custo do Estoque é um lançamento contábil"> Valor Lançamento </th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each entrada.fe ?? [] as fluxo, i}
              <tr class="!whitespace-nowrap">
                <td>{mapFluxoEstoque.get(fluxo.tipo_fe)}</td>
                <td>
                  <div class="flex gap-1 items-center justify-center">
                    {fluxo.responsavel ?? ''}
                    <ExternalLinkIcon href={`/estoque/pessoas/${fluxo.responsavel_id}`} data-tooltip="Abrir Detalhes do Responsável" data-placement="top" />
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
                <td>{fluxo.codigo}</td>
                <td>{fluxo.observacoes ?? ''}</td>
                <!-- <td>{mapFluxoContabil.get(fluxo.tipo_fc) ?? ''}</td> -->
                <td><VariacaoNumero value={fluxo.qntd} /></td>
                <td>{formatMoeda(-fluxo.custo)}</td>
                <td class="flex gap-1">
                  <ExternalLinkIcon href={`/estoque/inventario/${fluxo.estoque_id}`} data-tooltip="Abrir Detalhes do Estoque" data-placement="left" />
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="6" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalVariacaoEstoque} /></td>
              <td>{formatMoeda(totalCustoEstoque)}</td>
              <td colspan="100" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Outros Lançamentos</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th class="w-0">Fluxo Contábil</th>
              <th>Classe</th>
              <th>Observações</th>
              <th class="w-0">Valor Lançamento</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each entrada?.fc ?? [] as { classe_fc, tipo_fc, valor, observacoes }, j}
              <tr>
                <td class="!whitespace-nowrap">{mapFluxoContabil.get(tipo_fc)}</td>
                <td class="!whitespace-nowrap">{mapFluxoContabilClasse.get(classe_fc)}</td>
                <td>{observacoes ?? ''}</td>
                <td>{formatMoeda(valor * (classe_fc == FCC_CUSTO ? -1 : 1))}</td>
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
              <td>{formatMoeda(totalOutrosLancamentos)}</td>
              <td />
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
              <th class="w-0">Valor</th>
              <th class="w-0" data-tooltip="O Valor do Encargo é um lançamento contábil" data-placement="left"> Valor Encargo </th>
              <th class="w-0">Balanço Conta</th>
              <th class="w-0">#</th>
            </tr>
          </thead>
          <tbody>
            {#each entrada.ff ?? [] as fluxo, i}
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
                <td>{formatMoeda(fluxo.valor)}</td>
                <td>{formatMoeda(fluxo.valor_encargo) || '-'}</td>
                <td>{formatMoeda(fluxo.valor + (fluxo.valor_encargo ?? 0))}</td>
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
              <td colspan="2" />
              <th class="text-right">Total</th>
              <td>{formatMoeda(totalTransacoes)}</td>
              <td>{formatMoeda(totalEncargos)}</td>
              <td>{formatMoeda(resultadoTransacoes)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="col-span-12">
        <SuperDebug data={entrada} />
      </div>
    </div>
  </div>
</div>
