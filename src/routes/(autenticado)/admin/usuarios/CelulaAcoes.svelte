<script>
  import IconButton from '$lib/components/IconButton.svelte'
  import { USUARIO_ADMINISTRADOR } from '$lib/globals'
  import { modalStore } from '@skeletonlabs/skeleton'
  import ModalFormUsuario from './ModalFormUsuario.svelte'
  export let formData, initialData, permOptions

  $: propsEditar = {
    modo: 'editar',
    formData,
    permOptions,
    initialData: {
      id: initialData.id,
      senha: undefined,
      senha_repetir: undefined,
      nome: initialData.nome,
      email: initialData.email,
      tipo_usuario: initialData.tipo_usuario
    }
  }

  function handleEditar() {
    modalStore.trigger({
      type: 'component',
      component: { ref: ModalFormUsuario, props: propsEditar }
    })
  }
  $: disabled = initialData.tipo_usuario === USUARIO_ADMINISTRADOR
</script>

<div class="flex flex-nowrap gap-3">
  <IconButton disabled icon="fa6-solid:arrow-up-right-from-square" data-tooltip="Abrir Detalhes" data-placement="left" />
  <IconButton on:click={handleEditar} icon="fa6-solid:pen-to-square" {disabled} data-tooltip="Editar" data-placement="left" />
</div>
