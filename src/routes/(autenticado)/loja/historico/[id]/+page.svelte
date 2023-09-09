<script>
  import { enhance } from '$app/forms'
  import { downloadBufferBase64 } from '$lib/client.js'
  import ExternalLinkIcon from '$lib/components/ExternalLinkIcon.svelte'
  import Button from '$lib/components/Forms/Button.svelte'
  import ShowBox from '$lib/components/ShowBox.svelte'
  import VariacaoNumero from '$lib/components/VariacaoNumero.svelte'
  import {
    FE_BUYBACK,
    FE_VENDA,
    PE_PERDA,
    PE_VENDA_COM_BUYBACK,
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
  import { CodeBlock } from '@skeletonlabs/skeleton'
  import { fromJSON } from 'postcss'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data

  $: entrada = data.entrada || {}
  $: totalQntdEstoque = entrada.fe?.reduce((acc, { var_qntd }) => acc + var_qntd, 0)
  $: totalCustoEstoque = entrada.fe?.reduce((acc, { var_custo }) => acc + var_custo, 0)
  $: totalTransacoes = entrada.ff?.reduce((acc, { valor }) => acc + valor, 0)
  $: totalEncargos = entrada.ff?.reduce((acc, { encargo_valor }) => acc + (encargo_valor || 0), 0)
  $: totalOutrosLancamentos = entrada.fc?.reduce((acc, { valor }) => acc + valor, 0)
  $: totalCustos = entrada.fc?.reduce((acc, { valor, tipo_fc }) => acc + (isCusto(tipo_fc) ? valor : 0), 0)
  $: totalReceitas = entrada.fc?.reduce((acc, { valor, tipo_fc }) => acc + (isReceita(tipo_fc) ? valor : 0), 0)
  $: varTransacoes = totalTransacoes + totalEncargos
  $: varPatrimonio = totalCustoEstoque + varTransacoes
  $: resultadoContabil = totalCustos + totalReceitas
  $: buybacks = entrada.fe.filter((v) => v.tipo_fe === FE_BUYBACK) ?? []
</script>

<div class="grid place-items-center">
  <div class="container w-full bg-gradient-to-l from-primary-300 to-secondary-200 dark:from-primary-700 dark:to-secondary-800 px-2 rounded-t-md">
    <ol class="breadcrumb">
      <li class="crumb text-tertiary-600-300-token"><div class="flex flex-nowrap gap-1 items-center justify-center"><Icon icon="mdi:warehouse" />Loja</div></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li class="crumb"><a class="anchor" href="/loja/historico">Histórico de Vendas</a></li>
      <li class="crumb-separator" aria-hidden>&rsaquo;</li>
      <li>Ver Detalhes</li>
    </ol>
  </div>
  <div class="container grid gap-3 bg-surface-100-800-token p-2 rounded-b-md">
    <div class="flex items-center justify-center">
      <h3 class="h3 text-center mr-3">Detalhes do Processo</h3>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-4">
        <ShowBox label="Processo de Estoque">
          {mapProcessoEstoque.get(entrada.tipo_pe)}
        </ShowBox>
      </div>
      <div class="col-span-4">
        <ShowBox label="Usuário Criador">{entrada.criador ?? '-'}</ShowBox>
      </div>
      <div class="col-span-4">
        <ShowBox label="Data de Criação">{formatDateTime(entrada.criacao)}</ShowBox>
      </div>
      <div class="col-span-3">
        <ShowBox label="Responsável">{entrada.responsavel ?? '-'}</ShowBox>
      </div>
      <div class="col-span-3">
        <ShowBox label="Cliente">{entrada.participante ?? '-'}</ShowBox>
      </div>
      <div class="col-span-6">
        <ShowBox label="Observações">{entrada.observacoes ?? '-'}</ShowBox>
      </div>

      {#if entrada.tipo_pe == PE_VENDA_COM_BUYBACK}
        <div class="col-span-12 flex justify-center">
          <form
            action="?/reciboBuyback"
            method="POST"
            use:enhance={() =>
              ({ result }) =>
                downloadBufferBase64(result.data, 'application/pdf')}
          >
            <Button type="submit" text="Recibo de Buyback" data-tooltip="Recibo resumido do Buyback" class="variant-ghost-success dark:text-white text-black" icon="fa6-solid:receipt" />
          </form>
        </div>
      {/if}
      <div class="col-span-12 grid grid-cols-4">
        <div class="col-span-1" />
        <div class="col-span-2">
          <CodeBlock code={resumirProcesso(entrada)} shadow="shadow-xl" buttonLabel="Copiar" language={`Resumo da ${mapProcessoEstoque.get(entrada.tipo_pe)}`} />
        </div>
        <div class="col-span-1" />
      </div>

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Itens Vendidos</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center whitespace-nowrap">
          <thead>
            <tr class="!text-center">
              <th class="w-0">EID</th>
              <th>Vendedor</th>
              <th>Origem</th>
              <th>Condição</th>
              <th>Produto</th>
              <th>Código</th>
              <th>Observações</th>
              <th class="w-0">Qntd Vendida</th>
              <th class="w-0">Preço Deduzido</th>
            </tr>
          </thead>
          <tbody>
            {#each entrada.fe ?? [] as fluxo, i}
              {#if fluxo.tipo_fe === FE_VENDA}
                {@const recs = entrada.fc.filter((v) => v.estoque_id == fluxo.estoque_id && isReceita(v.tipo_fc))}
                {@const total = recs.reduce((acc, v) => acc + v.valor, 0)}
                <tr class="!whitespace-nowrap">
                  <td>{fluxo.id}</td>
                  <td>
                    <div class="flex gap-1 items-center justify-center">{fluxo.responsavel ?? '-'}</div>
                  </td>
                  <td>{mapOrigem.get(fluxo.origem)}</td>
                  <td>{mapCondicao.get(fluxo.condicao)}</td>
                  <td>
                    <div class="flex gap-1 items-center justify-center">{fluxo.produto}</div>
                  </td>
                  <td>{fluxo.codigo ?? ''}</td>
                  <td>{fluxo.observacoes ?? ''}</td>
                  <td><VariacaoNumero value={-fluxo.var_qntd} /></td>
                  <td><VariacaoNumero value={total} type="currency" /></td>
                </tr>
                <tr>
                  <td colspan="100" class="!p-1 !pl-72 !bg-surface-50-900-token">
                    <table class="table !p-0 !m-0">
                      <thead class="!p-0 !m-0 !bg-surface-300-600-token" style="opacity: 0.7;">
                        <tr class="!p-0 !m-0 !text-center">
                          <th class="!p-1">Lançamento</th>
                          <th class="!p-1">Observação</th>
                          <th class="!p-1">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each recs as { tipo_fc, valor, observacoes }}
                          <tr>
                            <td class="!p-1">{mapFluxoContabil.get(tipo_fc)}</td>
                            <td class="!p-1">{observacoes ?? ''}</td>
                            <td class="!p-1"><VariacaoNumero value={valor} type="currency" /></td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
          <!-- <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="7" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalQntdEstoque} /></td>
              <td><VariacaoNumero value={totalCustoEstoque} type="currency" /></td>
              <td colspan="100" />
            </tr>
          </tfoot> -->
        </table>
      </div>
      {#if buybacks?.length > 0}
        <div class="col-span-12 flex items-center">
          <h3 class="h3 text-center mr-3">Itens Recebidos (BuyBack)</h3>
        </div>

        <div class="col-span-12 table-container border border-surface-600">
          <table class="table table-hover text-center whitespace-nowrap">
            <thead>
              <tr class="!text-center">
                <th class="w-0">EID</th>
                <th>Vendedor</th>
                <th>Origem</th>
                <th>Condição</th>
                <th>Produto</th>
                <th>Código</th>
                <th>Observações</th>
                <th class="w-0">Qntd Recebida</th>
                <th class="w-0">Valor Custo</th>
              </tr>
            </thead>
            <tbody>
              {#each entrada.fe ?? [] as fluxo, i}
                {#if fluxo.tipo_fe === FE_BUYBACK}
                  <tr class="!whitespace-nowrap">
                    <td>{fluxo.id}</td>
                    <td>
                      <div class="flex gap-1 items-center justify-center">
                        {fluxo.responsavel ?? '-'}
                      </div>
                    </td>
                    <td>{mapOrigem.get(fluxo.origem)}</td>
                    <td>{mapCondicao.get(fluxo.condicao)}</td>
                    <td>
                      <div class="flex gap-1 items-center justify-center">
                        {fluxo.produto}
                      </div>
                    </td>
                    <td>{fluxo.codigo ?? ''}</td>
                    <td>{fluxo.observacoes ?? ''}</td>
                    <!-- <td>{mapFluxoContabil.get(fluxo.tipo_fc) ?? ''}</td> -->
                    <td><VariacaoNumero value={fluxo.var_qntd} /></td>
                    <td><VariacaoNumero value={fluxo.var_custo} type="currency" /></td>
                  </tr>
                {/if}
              {/each}
            </tbody>
            <!-- <tfoot class="!variant-soft">
              <tr class="!text-center">
                <td colspan="7" />
                <th class="text-right">Total</th>
                <td><VariacaoNumero value={totalQntdEstoque} /></td>
                <td><VariacaoNumero value={totalCustoEstoque} type="currency" /></td>
                <td colspan="100" />
              </tr>
            </tfoot> -->
          </table>
        </div>
      {/if}

      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Transações</h3>
      </div>

      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover text-center">
          <thead>
            <tr class="!text-center whitespace-nowrap">
              <!-- <th class="w-0">Fluxo Financeiro</th> -->
              <th>Conta</th>
              <th>Forma Transação</th>
              <th class="w-0">Taxa Encargo</th>
              <th class="w-0">Valor</th>
              <th class="w-0" data-tooltip="O Valor do Encargo é um lançamento contábil" data-placement="left"> Valor Encargo </th>
            </tr>
          </thead>
          <tbody>
            {#each entrada.ff ?? [] as fluxo, i}
              <tr class="!whitespace-nowrap">
                <!-- <td>{mapFluxoFinanceiro.get(fluxo.tipo_ff)}</td> -->
                <td>
                  <div class="flex gap-1 items-center justify-center whitespace-nowrap">
                    {fluxo.conta}
                  </div>
                </td>
                <td>
                  <div class="flex gap-1 items-center justify-center whitespace-nowrap">
                    {fluxo.conta_forma + (fluxo.parcela > 0 ? ` ${fluxo.parcela}x` : '')}
                  </div>
                </td>
                <td>{formatTaxa(fluxo.taxa_encargo)}%</td>
                <td><VariacaoNumero value={fluxo.valor} type="currency" /></td>
                <td><VariacaoNumero value={fluxo.encargo_valor} type="currency" /></td>
              </tr>
            {:else}
              <tr>
                <td colspan="100">Nenhuma transação foi encontrada</td>
              </tr>
            {/each}
          </tbody>
          <!-- <tfoot class="!variant-soft">
            <tr class="!text-center">
              <td colspan="3" />
              <th class="text-right">Total</th>
              <td><VariacaoNumero value={totalTransacoes} type="currency" /></td>
              <td><VariacaoNumero value={totalEncargos} type="currency" /></td>
              <td><VariacaoNumero value={varTransacoes} type="currency" /></td>
              <td />
            </tr>
          </tfoot> -->
        </table>
      </div>
      <!-- 
      <div class="col-span-12">
        <SuperDebug data={entrada} />
      </div> -->
    </div>
  </div>
</div>
