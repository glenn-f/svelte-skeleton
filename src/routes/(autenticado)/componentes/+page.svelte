<script>
  import InputMask from '../../../lib/components/Forms/InputMask.svelte'
  import InputMoeda from '../../../lib/components/Forms/InputMoeda.svelte'
  import InputTelefone from '../../../lib/components/Forms/InputTelefone.svelte'
  import Props from '../../../lib/components/Forms/Props.svelte'
  import InputCPF from './../../../lib/components/Forms/InputCPF.svelte'
  import InputCPNJ from './../../../lib/components/Forms/InputCPNJ.svelte'
  let cpf = '015',
    cnpj = '',
    tel = '', cep='12.0'
</script>


<!-- <InputMask name="cep" mask="000-000-000" bind:value={cep} /> -->
<InputMoeda name="sl" bind:value={cep} />
