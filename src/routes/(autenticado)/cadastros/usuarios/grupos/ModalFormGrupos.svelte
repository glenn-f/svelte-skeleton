<script>
  import { invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import HelperMessage from '$lib/components/Forms/HelperMessage.svelte'
  import InputCheck from '$lib/components/Forms/InputCheck.svelte'
  import InputGroup from '$lib/components/Forms/InputGroup.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
  import Icon from '@iconify/svelte'
  import { modalStore, toastStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'
  import { superForm } from 'sveltekit-superforms/client'
  /** Modo em que o modal será aberto
   * @type {'adicionar' | 'editar'} */
  export let modo = 'adicionar'
  /** Dados do formulário recebidos do superValidate pelo lado do servidor */
  export let formData
  /** Preenchimento inicial do formulário. Varia de acordo com o `modo` deste componente*/
  export let initialData = {
    nome: '',
    pode_iniciar_venda: false,
    pode_ver_estoque_disponivel: false,
    pode_ver_historico_vendas: false,
    pode_ver_estoque: false,
    pode_entrada_estoque: false,
    pode_saida_estoque: false,
    pode_ver_saldo: false,
    pode_transacao_receita: false,
    pode_transacao_despesa: false,
    pode_cadastrar_produto: false,
    pode_cadastrar_pessoa: false,
    pode_cadastrar_conta: false,
    pode_cadastrar_usuario: false
  }

  const { form, errors, enhance, message } = superForm(formData, {
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

  let action, titulo, pw_placeholder
  $: if (modo == 'editar') {
    action = '?/editar'
    titulo = 'Editar'
    pw_placeholder = 'Não alterado'
  } else {
    action = '?/adicionar'
    titulo = 'Adicionar'
    pw_placeholder = ''
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
      <h2 class="h2">{titulo} Grupo</h2>
    </svelte:fragment>

    <section class="grid grid-cols-12 gap-1 px-3">
      <div class="col-span-12">
        <InputText label="Nome do Grupo de Usuários" placeholder="Ex: Gerência de Vendas" name="nome" bind:value={$form.nome} error={$errors.nome} errorSpacing required />
      </div>
      <h6 class="h6 col-span-12">
        Permissões do Grupo <hr />
      </h6>
      <div class="col-span-12 grid grid-cols-12 gap-2">
        <div class="col-span-6">
          <InputGroup>
            <div class="flex gap-1" slot="label">
              <Icon icon="fa6-solid:store" width="16px" height="16px" /> Loja
            </div>
            <div class="grid grid-cols-2 whitespace-nowrap">
              <InputCheck label="Iniciar Venda" name="pode_iniciar_venda" bind:checked={$form.pode_iniciar_venda} />
              <InputCheck label="Estoque Disponível" name="pode_ver_estoque_disponivel" bind:checked={$form.pode_ver_estoque_disponivel} />
              <InputCheck label="Histórico de Vendas" name="pode_ver_historico_vendas" bind:checked={$form.pode_ver_historico_vendas} />
            </div>
          </InputGroup>
        </div>
        <div class="col-span-6">
          <InputGroup>
            <div class="flex gap-1" slot="label">
              <Icon icon="mdi:warehouse" width="16px" height="16px" /> Estoque
            </div>
            <div class="grid grid-cols-2 whitespace-nowrap">
              <InputCheck label="Inventário" name="pode_ver_estoque" bind:checked={$form.pode_ver_estoque} />
              <InputCheck label="Entradas de Estoque" name="pode_entrada_estoque" bind:checked={$form.pode_entrada_estoque} />
              <InputCheck label="Saídas de Estoque" name="pode_saida_estoque" bind:checked={$form.pode_saida_estoque} />
            </div>
          </InputGroup>
        </div>
      </div>
      <div class="col-span-12 grid grid-cols-12 gap-2">
        <div class="col-span-6">
          <InputGroup>
            <div class="flex gap-1" slot="label">
              <Icon icon="ic:round-currency-exchange" width="16px" height="16px" /> Transações
            </div>
            <div class="grid grid-cols-2 whitespace-nowrap">
              <InputCheck label="Saldo de Contas" name="pode_ver_saldo" bind:checked={$form.pode_ver_saldo} />
              <InputCheck label="Histórico Receitas" name="pode_transacao_receita" bind:checked={$form.pode_transacao_receita} />
              <InputCheck label="Histórico Despesas" name="pode_transacao_despesa" bind:checked={$form.pode_transacao_despesa} />
            </div>
          </InputGroup>
        </div>
        <div class="col-span-6">
          <InputGroup>
            <div class="flex gap-1" slot="label">
              <Icon icon="fa6-solid:book" width="16px" height="16px" /> Cadastros
            </div>
            <div class="grid grid-cols-2 whitespace-nowrap">
              <InputCheck label="Usuários" name="pode_cadastrar_usuario" bind:checked={$form.pode_cadastrar_usuario} />
              <InputCheck label="Contas" name="pode_cadastrar_conta" bind:checked={$form.pode_cadastrar_conta} />
              <InputCheck label="Produtos" name="pode_cadastrar_produto" bind:checked={$form.pode_cadastrar_produto} />
              <InputCheck label="Pessoas" name="pode_cadastrar_pessoa" bind:checked={$form.pode_cadastrar_pessoa} />
            </div>
          </InputGroup>
        </div>
      </div>
    </section>

    <div class="grid place-items-center gap-2" slot="footer">
      {#if $message}
        <HelperMessage error={$message} spaceHolding={true} />
      {/if}
      <div class="flex gap-2">
        <button type="submit" class="btn variant-filled-primary" name="id" value={$form.id}>Enviar</button>
        <button type="button" class="btn variant-filled-secondary" on:click={modalStore.close}>Cancelar</button>
      </div>
    </div>
  </CardModal>
</form>
