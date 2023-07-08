<script>
  import { page } from '$app/stores'
  import DevAccordion from '../lib/components/DevAccordion.svelte'
</script>

<div class="grid place-content-center grid-cols-5 bgerror h-full w-full">
  <h1 class="h1 col-span-2 text-right pr-3">
    {$page.status}
  </h1>
  <div class="col-span-3 border-l pl-3 border-gray-600 w-1/2">
    <h4 class="h4 pb-5">{$page.error.message}</h4>
    <a href="/" class="anchor">➡️ Ir para Início</a>

    {#if $page.error?.code}
      <p class="text-gray-500 py-3">
        Código do Erro: <b>{$page.error.code}</b>
      </p>
    {/if}
    <DevAccordion data={$page} />
  </div>
</div>

<style>
  .bgerror {
    background-color: #DDD;
  }
  @media (prefers-color-scheme: dark) {
    .bgerror {
      background-color: #222;
    }
  }
</style>
