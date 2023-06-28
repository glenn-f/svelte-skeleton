<script>
  import Icon from '@iconify/svelte'
  import { modalStore, popup } from '@skeletonlabs/skeleton'
  import FormEditarUsuario from './FormEditarUsuario.svelte'
  export let dataRow, permOptions

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: FormEditarUsuario,
        props: { dataRow, permOptions },
        slot: '<p>Skeleton</p>'
      }
    })
  }
</script>

<div class="flex flex-nowrap gap-3">
  <button name="id" on:click|preventDefault={handleEditar} use:popup={{ event: 'hover', target: 'hoverEditar', placement: 'top' }}>
    <Icon icon="fa6-solid:pen-to-square" class="hover:text-primary-500-400-token" />
    <div class="card p-4 variant-filled-primary" data-popup="hoverEditar">
      <p>Editar</p>
      <div class="arrow variant-filled-primary" />
    </div>
  </button>

  <button name="id" on:click|preventDefault={handleEditar} use:popup={{ event: 'hover', target: 'hoverApagar', placement: 'top' }}>
    <Icon icon="fa6-solid:trash-can" class="hover:text-primary-500-400-token" />
    <div class="card p-4 variant-filled-primary" data-popup="hoverApagar">
      <p>Apagar</p>
      <div class="arrow variant-filled-primary" />
    </div>
  </button>

  <button name="id" on:click|preventDefault={handleEditar} use:popup={{ event: 'hover', target: 'hoverAbrir', placement: 'top' }}>
    <Icon icon="fa6-solid:arrow-up-right-from-square" class="hover:text-primary-500-400-token" />
    <div class="card p-4 variant-filled-primary" data-popup="hoverAbrir">
      <p>Abrir Detalhes</p>
      <div class="arrow variant-filled-primary" />
    </div>
  </button>
</div>
