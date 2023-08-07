<script>
  /** Tipo da mensagem exibida. Altera o esquema de cores da mensagem.
   * @type {"error" | "success" | "warning"} */
  export let type = undefined

  /** Mensagem para exibição no esquema de cores padrão.
   * @type {string | string[]} */
  export let message = undefined

  /** Mensagem para exibição no esquema de cores de `erro`.
   * @type {string | string[]} */
  export let error = undefined

  /** Mensagem para exibição no esquema de cores de `alerta`.
   * @type {string | string[]} */
  export let warning = undefined

  /** Mensagem para exibição no esquema de cores de `sucesso`.
   * @type {string | string[]} */
  export let success = undefined

  /** Reservar o espaço da mensagem quando ela estiver vazia (use quando estiver quebrando a formatação).
   * Valor padrão: `false`
   * @type {false | true} */
  export let spaceHolding = false

  /** Caso a mensagem seja um **Array**, este **separador** será utilizado na construção da mensagem final.
   * Valor padrão: `', '`
   * @type {string} */
  export let sep = ', '

  let _message = ''
  let _type = ''

  $: {
    if (message?.length > 0) {
      _message = Array.isArray(message) ? message.join(sep) : message
      _type = type ?? ''
    } else if (error?.length > 0) {
      _message = Array.isArray(error) ? error.join(sep) : error
      _type = 'error'
    } else if (warning?.length > 0) {
      _message = Array.isArray(warning) ? warning.join(sep) : warning
      _type = 'warning'
    } else if (success?.length > 0) {
      _message = Array.isArray(success) ? success.join(sep) : success
      _type = 'success'
    } else {
      _message = ''
      _type = ''
    }
  }
</script>

<span
  class="text-sm"
  class:text-slate-500={_type == ''}
  class:text-error-500-400-token={_type == 'error'}
  class:text-warning-500-400-token={_type == 'warning'}
  class:text-success-500-400-token={_type == 'success'}
  class:spaceHolding
>
  {_message}
</span>