<script>
  import { formatInteger, formatMoeda } from '$lib/helpers'
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'

  export let icon, title, value, color
  let { qntd, custo, preco } = value
</script>

<div class="col-span-1 card p-2 card-hover border-2" style={`background-color: ${color};`}>
  <span class="flex flex-col items-center gap-3">
    <span class="flex justify-center items-center gap-2">
      {#if icon}
        <Icon {icon} width="36px" height="36px" />
      {/if}
      <span class="text-lg font-bold">
        {title}
      </span>
    </span>
    <div class="flex justify-between gap-2 text-md">
      <div class="flex flex-col items-center">
        <span class="font-bold">Quantidade</span>
        <span>
          {formatInteger(qntd) ?? '-'}
        </span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-bold"> Custo </span>
        <span>
          {formatMoeda(custo) ?? '-'}
        </span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-bold"> Preço </span>
        <span>
          {formatMoeda(preco) ?? '-'}
        </span>
      </div>
    </div>
  </span>
</div>
