<script>
  import moment from 'moment'
  import { onDestroy, onMount } from 'svelte'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data
  let tempoMin, tempoSec, interval
  onMount(() => {
    interval = setInterval(() => {
      tempoMin = moment.duration(moment(data?.sessao?.expiracao).diff()).asMinutes().toFixed()
      tempoSec = moment.duration(moment(data?.sessao?.expiracao).diff()).asSeconds().toFixed()
    }, 200)
  })
  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<SuperDebug {data} />

<h1 class="h1">Bem-vindo, {data?.sessao?.nome ?? 'Anônimo'}</h1>
<h3 class="h3">Seu e-mail é: <code class="code">{data?.sessao?.email ?? ''}</code>.</h3>
<h5 class="h5">
  Sua sessão expira em:
  <span class="text-red-400">{new Date(data?.sessao?.expiracao).toLocaleString()}</span>
  {#if tempoMin && tempoSec}
    -
    <span class="text-blue-400">{tempoMin} minutos</span> OU
    <span class="text-blue-400">{tempoSec} segundos</span>
  {/if}
</h5>
