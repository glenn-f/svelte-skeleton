<script>
  import InputDateTime from '$lib/components/Forms/InputDateTime.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import { FCC_CUSTO, mapCondicao, mapEstadoEstoque, mapFluxoContabil, mapFluxoContabilClasse, mapFluxoEstoque, mapOrigem, mapProcessoEstoque } from '$lib/globals.js'
  import { formatMoeda } from '$lib/helpers.js'
  import { fade } from 'svelte/transition'
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
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
      <div class="col-span-3">
        <InputText label="Nome do Produto" value={estoque.produto_nome} readonly />
      </div>
      <div class="col-span-2">
        <InputText label={'Código' + (estoque.titulo_codigo ? ` (${estoque.titulo_codigo})` : '')} value={estoque.codigo} readonly />
      </div>
      <div class="col-span-2">
        <InputText label="Origem" value={mapOrigem.get(estoque.origem)} readonly />
      </div>
      <div class="col-span-1">
        <InputText label="Condição" value={mapCondicao.get(estoque.condicao)} readonly />
      </div>
      <div class="col-span-2">
        <InputText label="Categoria" value={estoque.categoria} readonly />
      </div>
      <div class="col-span-2">
        <InputText label="Usuário que Inseriu" value={estoque.criador} readonly />
      </div>
      <div class="col-span-2">
        <InputText label="Estado Atual" value={mapEstadoEstoque.get(estoque.estado)} readonly />
      </div>
      <div class="col-span-1">
        <InputNumber label="Quantidade" value={estoque.qntd} readonly />
      </div>
      <div class="col-span-2">
        <InputMoeda label="Custo Unitário" value={estoque.custo / estoque.qntd} readonly />
      </div>
      <div class="col-span-2">
        <InputMoeda label="Preço de Venda Unitário" value={estoque.preco_unitario} readonly />
      </div>
      <div class="col-span-2">
        <InputDateTime label="Data de Criação" value={estoque.criacao} readonly />
      </div>
      <div class="col-span-2">
        {#if estoque.delecao}
          <InputDateTime label="Data de Deleção" value={estoque.delecao} readonly />
        {:else}
          <InputText label="Data de Deleção" value="-" readonly />
        {/if}
      </div>
      {#if estoque.observacoes}
        <div class="col-span-12">
          <InputText label="Observações" value={estoque.observacoes} readonly />
        </div>
      {/if}
      <div class="col-span-12 flex items-center">
        <h3 class="h3 text-center mr-3">Processos e Lançamentos</h3>
      </div>
      <div class="col-span-12 table-container border border-surface-600">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="w-0" />
              <th class="w-0">Data Processo</th>
              <th>Processo</th>
              <th>Fluxo</th>
              <th>Observações</th>
              <th class="w-0">Qntd</th>
              <th class="w-0">Resultado</th>
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
                    <Icon icon="fa6-solid:chevron-right" width="20px" height="20px" />
                  </button>
                </td>
                <td>{new Date(criacao).toLocaleString()}</td>
                <td>{mapProcessoEstoque.get(tipo_pe)}</td>
                <td>{mapFluxoEstoque.get(tipo_fe)}</td>
                <td>{fe_observacoes ?? ''}</td>
                <td>{qntd}</td>
                <td>{formatMoeda(contabil.reduce((acc, { valor, classe_fc }) => acc + valor * (classe_fc == FCC_CUSTO ? -1 : 1), 0))}</td>
                <td>botoes</td>
              </tr>
              {#if contabil?.length > 0}
                <td colspan="100" class="!p-0 transition-all" class:hidden>
                  <div class="grid grid-cols-12 bg-surface-200-700-token">
                    <div class="col-span-1 grid place-content-center text-center">
                      <!-- <Icon icon="mdi:chevron-down-box" width="32px" height="32px" class="text-tertiary-500" /> -->
                      <h6 class="h6">Lançamentos Contábeis</h6>
                    </div>
                    <div class="col-span-11 table-container border border-surface-400 !rounded-none">
                      <table class="table table-compact text-center !rounded-none">
                        <thead>
                          <tr class="!text-center">
                            <td />
                            <th class="!py-1">Classe</th>
                            <th class="!py-1">Tipo</th>
                            <th class="!py-1">Valor</th>
                            <th class="!py-1">Observações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each contabil ?? [] as { classe_fc, tipo_fc, valor, fc_observacoes }, j}
                            <tr>
                              <td />
                              <td>{mapFluxoContabilClasse.get(classe_fc)}</td>
                              <td>{mapFluxoContabil.get(tipo_fc)}</td>
                              <td>{formatMoeda(valor)}</td>
                              <td>{fc_observacoes ?? ''}</td>
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
      <div class="col-span-12">
        <SuperDebug data={estoque} />
      </div>
    </div>
  </div>
</div>
