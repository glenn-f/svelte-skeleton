<script>
  import { page } from '$app/stores'
  import GrafFat30 from './GrafFat30.svelte'
  import GrafPesFat30 from './GrafPesFat30.svelte'

  export let data
</script>

<div class="flex justify-center">
  <div class="container rounded-container-token">
    <div class="grid grid-cols-12 gap-2 w-full">
      <div class="col-span-12 text-center">
        <h1 class="h1">
          <span class="bg-gradient-to-br from-green-700 to-lime-300 bg-clip-text text-transparent box-decoration-clone">
            {$page?.data?.sessao?.empresa?.nome_fantasia}
          </span>
        </h1>
        <h4 class="h4">
          <span class="bg-gradient-to-br from-red-400 to-yellow-300 bg-clip-text text-transparent box-decoration-clone">
            Dashboard
          </span>
        </h4>
      </div>
      <div class="col-span-12 lg:col-span-6 card bg-white dark:bg-white">
        <GrafFat30 {data} />
      </div>
      <div class="col-span-12 lg:col-span-6 card bg-white dark:bg-white">
        <GrafPesFat30 {data} />
      </div>
    </div>
  </div>
</div>
