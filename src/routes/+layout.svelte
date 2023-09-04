<script>
  import '../app.postcss'
	import { initializeStores } from '@skeletonlabs/skeleton';
  import { Drawer, Modal, Toast, autoModeWatcher, storePopup } from '@skeletonlabs/skeleton'
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
  import { page } from '$app/stores'
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores();
</script>

<svelte:head>
  <title>{$page.data.title ?? $page.route?.id ?? ''}</title>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<Toast position="t" />
<Modal position="" buttonTextCancel="Cancelar" buttonTextConfirm="Confirmar" buttonTextSubmit="Enviar" />
<Drawer />

<slot />
