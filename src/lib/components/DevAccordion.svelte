<script>
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
</script>

{#if dev}
  <div class="bg-secondary-300-600-token">
    <Accordion>
      <AccordionItem>
        <svelte:fragment slot="lead">🧪</svelte:fragment>
        <svelte:fragment slot="summary">SuperDebug <b class="text-warning-600-300-token bg-gradient-to-br">$page</b> - <b>{$page.route.id}</b></svelte:fragment>
        <svelte:fragment slot="content">
          <SuperDebug data={$page} />
        </svelte:fragment>
      </AccordionItem>
    </Accordion>
  </div>
{/if}
