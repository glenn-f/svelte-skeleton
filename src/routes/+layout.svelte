<script>
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
</script>

<button
	class="btn variant-filled"
	on:click={() => modalStore.trigger({ type: 'confirm', title: 'Hello World!', value: 'eita' })}
	>EAE</button
>
<a class="btn variant-filled" href="/login">Login Page</a>
<Modal />
<slot />
