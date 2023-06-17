<script>
	import { DateTime } from 'luxon';
  import { onDestroy, onMount } from 'svelte'
  export let data
  let interval, fimSessao = DateTime.fromMillis(data.sessao?.expiracao ?? 0)
  onMount(() => {
    interval = setInterval(() => {
      fimSessao = DateTime.fromMillis(data.sessao?.expiracao ?? 0)
    }, 200)
  })
  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<h1 class="h1">Bem-vindo, {data.sessao?.nome ?? 'Anônimo'}</h1>
<h3 class="h3">Seu e-mail é: <code class="code">{data.sessao?.email}</code>.</h3>
<h5 class="h5">
  Sua sessão expira em: <span class="text-cyan-500">{fimSessao.toLocaleString(DateTime.DATETIME_SHORT)}</span>
  (tempo restante: <span class="text-red-400">{fimSessao.diffNow().toFormat("hh:mm:ss")}</span>)
</h5>
