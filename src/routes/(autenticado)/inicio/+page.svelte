<script>
  import { page } from '$app/stores'
  import Button from '$lib/components/Forms/Button.svelte'
  import { USUARIO_ADMINISTRADOR, USUARIO_MEMBRO } from '$lib/globals'
  import Icon from '@iconify/svelte'
  import GrafFat30 from './GrafFat30.svelte'
  import GrafPesFat30 from './GrafPesFat30.svelte'

  export let data
  $: adm = data.sessao?.perm == USUARIO_ADMINISTRADOR
  $: haEmpresa = !!data?.sessao?.empresa
  $: donoEmpresa = haEmpresa && data?.sessao?.empresa?.dono_id === data?.sessao.uid
  $: acessoGeral = adm || donoEmpresa
  $: gpe = data.sessao?.gpe || {}
</script>

<div class="flex justify-center">
  <div class="container rounded-container-token">
    <div class="grid grid-cols-12 gap-2 w-full">
      {#if haEmpresa}
        <div class="col-span-12 text-center">
          <!-- <h1 class="h1">
            <span class="bg-gradient-to-br from-green-700 to-lime-300 bg-clip-text text-transparent box-decoration-clone">
              {data.sessao?.empresa.nome_fantasia}
            </span>
          </h1> -->
          <h2 class="h2">
            <span class="bg-gradient-to-br from-red-400 to-yellow-300 bg-clip-text text-transparent box-decoration-clone"> Dashboard </span>
          </h2>
        </div>
        <!-- <div class="col-span-12">
          <Button href="/pdf" target="_blank" icon="fa6-solid:file-pdf" text="PDF" />
        </div> -->
        {#if gpe.pode_saida_estoque || acessoGeral}
          <div class="col-span-12 lg:col-span-6 card bg-white dark:bg-white">
            <GrafFat30 {data} />
          </div>
          <div class="col-span-12 lg:col-span-6 card bg-white dark:bg-white">
            <GrafPesFat30 {data} />
          </div>
        {:else}
          <div class="col-span-12 flex justify-center items-center gap-8 text-3xl my-20">
            <span>
              <Icon icon="eos-icons:compass" />
            </span>
            <span class=" font-black bg-gradient-to-br from-sky-700 to-yellow-300 text-transparent bg-clip-text box-decoration-clone"> Em Construção </span>
            <span>
              <Icon icon="eos-icons:rotating-gear" />
            </span>
          </div>
        {/if}
      {:else}
        <div class="col-span-12 text-center">
          <h1 class="h1">
            <span class="bg-gradient-to-br from-green-700 to-lime-300 bg-clip-text text-transparent box-decoration-clone">Bem</span>
            <span class="bg-gradient-to-br from-purple-400 to-sky-300 bg-clip-text text-transparent box-decoration-clone">→</span>
            <span class="bg-gradient-to-br from-red-400 to-yellow-300 bg-clip-text text-transparent box-decoration-clone">Vindo</span>
          </h1>
        </div>
      {/if}
    </div>
  </div>
</div>
