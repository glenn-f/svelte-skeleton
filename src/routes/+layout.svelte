<script>
  import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css'
  import '@skeletonlabs/skeleton/styles/skeleton.css'
  import '../app.postcss'
  import { Drawer, Modal, Toast, autoModeWatcher, storePopup } from '@skeletonlabs/skeleton'
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
  import { page } from '$app/stores'
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<svelte:head>
  <title>{$page.data.title ?? $page.route?.id ?? ''}</title>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<Toast position="t" />
<Modal position="absolute top-20 !h-min" buttonTextCancel="Cancelar" buttonTextConfirm="Confirmar" buttonTextSubmit="Enviar" />
<Drawer />

<slot />
