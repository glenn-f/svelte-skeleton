<script>
  import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css'
  import '@skeletonlabs/skeleton/styles/skeleton.css'
  import '../app.postcss'
  import { Drawer, Modal, Toast, autoModeWatcher } from '@skeletonlabs/skeleton'
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>{$page.data.title ?? $page.route?.id ?? ""}</title>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<Modal />
<Toast />
<Drawer />

<slot />
