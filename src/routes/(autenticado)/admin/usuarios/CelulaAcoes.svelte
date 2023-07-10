<script>
  import { SlideToggle, modalStore } from '@skeletonlabs/skeleton'
  import IconButton from '$lib/components/IconButton.svelte'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let formData, initialData, permOptions

  const initial = {
    id: initialData.id,
    senha: undefined,
    senha_repetir: undefined,
    nome: initialData.nome,
    email: initialData.email,
    tipo_usuario: initialData.tipo_usuario
  }

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'editar', initialData: initial, permOptions, formData } }
    })
  }

  function handleApagar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'apagar', initialData: initial, permOptions, formData } }
    })
  }
  let ativo = !initialData.delecao
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton href="usuarios/1" icon="fa6-solid:arrow-up-right-from-square">Abrir Detalhes</IconButton>
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square">Editar</IconButton>
</div>
