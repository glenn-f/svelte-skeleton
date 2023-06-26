<script>
  import InputMask from '../../../lib/components/Forms/InputMask.svelte'
  import InputMoeda from '../../../lib/components/Forms/InputMoeda.svelte'
  import InputPercent from '../../../lib/components/Forms/InputPercent.svelte'
  import InputTelefone from '../../../lib/components/Forms/InputTelefone.svelte'
  import Props from '../../../lib/components/Forms/Props.svelte'
  import InputCPF from './../../../lib/components/Forms/InputCPF.svelte'
  import InputCPNJ from './../../../lib/components/Forms/InputCPNJ.svelte'
  let cpf = '015',
    cnpj = '',
    tel = '',
    cep = '12.0',
    perc
</script>

<!-- <InputMask name="cep" mask="000-000-000" bind:value={cep} /> -->
<InputMoeda label="Moeda Exemplo" required name="sl" bind:value={cep} />
<InputPercent label="Perc Exemplo" min={0} max={100} qntdAposVirgula={2} required name="perc" bind:value={perc} />
