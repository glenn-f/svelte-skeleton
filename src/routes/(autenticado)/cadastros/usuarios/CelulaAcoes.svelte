<script>
  import IconButton from '$lib/components/IconButton.svelte'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  import { USUARIO_ADICIONAL } from '$lib/globals'
  export let formData, initialData, permOptions

  const initial = {
    id: initialData.id,
    senha: undefined,
    senha_repetir: undefined,
    nome: initialData.nome,
    email: initialData.email,
    gpe_id: initialData.gpe_id,
    tipo_usuario: initialData.tipo_usuario,
  }

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'editar', initialData: initial, permOptions, formData } }
    })
  }

  function handleSenha() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: { modo: 'senha', initialData: initial, permOptions, formData } }
    })
  }
  $: disabled = initial.tipo_usuario !== USUARIO_ADICIONAL
</script>

<div class="flex flex-nowrap gap-3">
  <!-- <IconButton href="usuarios/1" icon="fa6-solid:arrow-up-right-from-square">Abrir Detalhes</IconButton> -->
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square">Editar</IconButton>
  <IconButton {disabled} on:click={handleSenha} icon="fa6-solid:lock">Alterar Senha</IconButton>
</div>
