<script>
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import InputDate from '../../../../lib/components/Forms/InputDate.svelte'
  import { superForm } from 'sveltekit-superforms/client'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
  export let data
  let cpf = '015',
    cnpj = '',
    tel = '',
    cep = '12.0',
    perc

  let { form } = superForm(data.form)
</script>

<SuperDebug data={$form} />
<!-- <InputMask name="cep" mask="000-000-000" bind:value={cep} /> -->
<form class="grid place-items-center" method="POST">
  <div class="grid grid-cols-12 w-40 gap-2">
    <div class="col-span-full">
      <InputPercent label="Perc Exemplo" min={0} max={100} qntdAposVirgula={2} required name="perc" bind:value={$form.perc} />
    </div>
    <div class="col-span-full">
      <InputNumber label="Moeda Exemplo" required name="moeda" bind:value={$form.moeda} />
    </div>
    <div class="col-span-full">
      <InputDate label="Data Nascimento" max={new Date()} name="data" bind:value={$form.dn} />
    </div>
    <div class="col-span-full place-self-center">
      <button class="btn variant-filled">Enviar</button>
    </div>
  </div>
</form>
