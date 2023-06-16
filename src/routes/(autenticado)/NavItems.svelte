<script>
  const items = [
    { href: '/produtos', nome: 'Produtos' }
    //
  ]
</script>

<ul>
  {#each items as { href, nome }}
    <li>
      <a {href} class="btn bg-gradient-to-br variant-gradient-tertiary-primary">{nome}</a>
    </li>
  {/each}
</ul>
