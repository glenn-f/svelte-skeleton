<script>
  import InputDate from '$lib/components/Forms/InputDate.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data
  let cpf = '015',
    cnpj = '',
    tel = '',
    cep = '12.0',
    perc

  let { form } = superForm(data.form)
  $: d = new Date($form.dn)
</script>

<SuperDebug data={$form} />
<SuperDebug data={d} />
<!-- <InputMask name="cep" mask="000-000-000" bind:value={cep} /> -->
<form class="grid place-items-center" method="POST">
  <div class="grid grid-cols-12 w-48 gap-2">
    <div class="col-span-full">
      <InputNumber label="Numero" casasDecimais={0} required name="perc" bind:value={$form.num} />
    </div>
    <div class="col-span-full">
      <InputPercent label="Perc Exemplo" casasDecimais={2} required name="perc" bind:value={$form.perc} />
    </div>
    <div class="col-span-full">
      <InputMoeda label="Moeda Exemplo" required name="moeda" bind:value={$form.moeda} />
    </div>
    <div class="col-span-full">
      <InputDate label="Data Nascimento" name="dn" bind:value={$form.dn} />
    </div>
    <div class="col-span-full place-self-center">
      <button class="btn variant-filled">Enviar</button>
    </div>
  </div>
</form>
