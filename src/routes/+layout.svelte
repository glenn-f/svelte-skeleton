<script>
  import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css'
  import '@skeletonlabs/skeleton/styles/skeleton.css'
  import '../app.postcss'
  import { Drawer, Modal, Toast } from '@skeletonlabs/skeleton'
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>{$page.data.title ?? $page.route?.id ?? ""}</title>
</svelte:head>

<Modal />
<Toast />
<Drawer />

<slot />
