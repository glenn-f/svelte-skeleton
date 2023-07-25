<script>
  import Form from '$lib/components/Forms/Form.svelte'
  import InputCheck from '$lib/components/Forms/InputCheck.svelte'
  import InputDate from '$lib/components/Forms/InputDate.svelte'
  import InputGroup from '$lib/components/Forms/InputGroup.svelte'
  import InputMoeda from '$lib/components/Forms/InputMoeda.svelte'
  import InputNumber from '$lib/components/Forms/InputNumber.svelte'
  import InputPercent from '$lib/components/Forms/InputPercent.svelte'
  import InputText from '$lib/components/Forms/InputText.svelte'
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
<Form class="grid place-items-center" method="POST" bind:formStore={form}>
  <div class="grid grid-cols-12 w-48 gap-2">
    <div class="col-span-full">
      <InputText label="Text Form Input" required name="formText" />
    </div>
    <div class="col-span-full">
      <InputText label="Text Form Input" required name="formText2" />
    </div>
    <div class="col-span-full">
      <InputNumber label="Numero" casasDecimais={0} required name="perc" bind:value={$form.num} />
    </div>
    <div class="col-span-full">
      <InputPercent label="Perc Exemplo" casasDecimais={2} required name="perc" bind:value={$form.perc} />
    </div>
    <div class="col-span-full">
      <InputMoeda label="Moeda Exemplo" required name="moeda" />
    </div>
    <div class="col-span-full">
      <InputDate label="Data Nascimento" name="dn" bind:value={$form.dn} />
    </div>
    <div class="col-span-full place-self-center">
      <button class="btn variant-filled">Enviar</button>
    </div>
    <div class="col-span-full">
      <InputGroup label="Menu Loja">
        <div class="grid grid-cols-2 whitespace-nowrap">
          <InputCheck label="Iniciar Venda" name="check" bind:checked={$form.check} />
          <InputCheck label="Estoque Disponível" name="check2" bind:checked={$form.check2} />
          <InputCheck label="Histórico de Vendas" name="check3" bind:checked={$form.check3} />
        </div>
      </InputGroup>
    </div>
  </div>
</Form>
