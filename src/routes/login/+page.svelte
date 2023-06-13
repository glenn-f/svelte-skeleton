<script>
	export let form;
</script>

<div class="grid place-items-center">
	<div class="w-[300px]">
        <form method="post" class="grid place-items-center">
            <h3 class="h3 text-center mb-5">Autenticar</h3>
			<input class="input my-2" type="text" placeholder="E-mail" name="email" required />
			<input class="input my-2" type="password" placeholder="Senha" name="senha" required />
			{#if form?.errorMessage}
				<div class="has-text-danger my-2">{form.errorMessage}</div>
			{/if}
			<button class="btn variant-filled-primary mt-3" type="submit" formaction="?/login">Entrar</button>
		</form>
	</div>
</div>
