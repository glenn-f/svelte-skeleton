<script>
  import { enhance } from '$app/forms'
  import { goto, invalidateAll } from '$app/navigation'
  import CardModal from '$lib/components/CardModal.svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  export let data
  const modalStore = getModalStore()
  const toastStore = getToastStore()
</script>

<CardModal>
  <svelte:fragment slot="header">
    <h2 class="h2">Estornar Venda</h2>
  </svelte:fragment>
  <form
    id="formEstorno"
    action="?/estornar"
    method="POST"
    class="grid grid-cols-12 gap-1 px-3"
    use:enhance={() =>
      async ({ result }) => {
        const { data: message, type } = result
        modalStore.close()
        if (type == 'success') {
          await goto('.')
          invalidateAll()
          if (!message) return
          toastStore.trigger({
            message,
            background: 'bg-success-500'
          })
        } else {
          return toastStore.trigger({
            message,
            background: 'bg-error-500'
          })
        }
      }}
  >
    <div class="col-span-12">O processo de estorno efetuará o seguinte processo:</div>
    <pre class="col-span-12">
  - desfazer os lançamentos de custos por estoque (se houver)
  - desfazer os custos de transação por estoque (taxa de maquininha, se houver)
  - desassociar estoque da venda de estoque para cada item vendido
  - lançamentos de entrada contábil e monetária (pagamento)
  - desfazer lançamentos de tributos
  - mesma coisa pra comissão
  - devolver a quantidade de estoque
  - marcar a venda como estorno
    </pre>
    <div class="col-span-12 text-center my-4">
      <h4 class="h4">Tem certeza que deseja continuar?</h4>
    </div>
  </form>

  <div class="grid place-items-center gap-2" slot="footer">
    <div class="flex gap-2">
      <button type="submit" form="formEstorno" class="btn variant-filled-error">Efetuar Estorno</button>
      <button type="button" class="btn variant-filled-tertiary" on:click={modalStore.close}>Cancelar</button>
    </div>
  </div>
</CardModal>
