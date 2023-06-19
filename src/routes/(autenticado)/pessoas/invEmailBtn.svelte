<script>
	import  Icon  from '@iconify/svelte';
  export let id

  function sendEmail() {
    console.log(id)

    fetch(`/api/invoices/${id}/email`, {
      method: 'POST'
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data)
      })
  }
</script>

<button class="btn-icon" on:click={sendEmail}><Icon icon="fa6-solid:envelope"/></button>
