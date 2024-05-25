<script>
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'

  /** @type {import('./$types').PageData} */
  export let data
  let glowEffect, imageContainer

  onMount(() => {
    if (imageContainer && glowEffect) {
      imageContainer.addEventListener('mousemove', (e) => {
        const rect = imageContainer.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        glowEffect.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 255, 0, 0.15), rgba(0, 255, 255, 0.09))`
        glowEffect.style.opacity = 1
      })

      imageContainer.addEventListener('mouseleave', () => {
        glowEffect.style.opacity = 0
      })
    }
  });
</script>
<svelte:head>
  <title>Deluxe Cases - Sua experiência completa com iPhone! </title>
</svelte:head>
<div class="h-auto bg-black">
    <nav class="bg-black w-full h-16 border-b border-gray-600">
      <div class="text container mx-auto flex items-center justify-between h-full">
        <div class="flex items-center">
            <a href="/" class="text-white font-bold">
              <div class="image-container" bind:this={imageContainer}>
                <img class="h-14" src="/brand.png" alt="" />
                <div class="glow-effect" bind:this={glowEffect} />
              </div>
            </a>
            <div class="flex items-center gap-8 ml-5">
                <a href="/about" class="text-white font-bold">Quem Somos</a>
                <a href="/contact" class="text-white font-bold">Contato</a>
            </div>
        </div>
        <div class="rounded-full bg-white p-1 px-3">
            <a href="/login" class="text-black">
                Login
            </a>
        </div>
      </div>
    </nav>
    <div class="container mx-auto h-[850px] bg-image border-b border-gray-900">
        <div class="flex">
            <div class="w-32"></div>
            <div class="flex flex-col">
                <div class="h-24">

                </div>
                <h5 class="h4 font-sans mb-3">iPhones</h5>
                <h3 class="h1 font-sans w-96 linha-maior">
                    Mais que acessórios, uma experiência completa para o seu iPhone!
                </h3>
                <div class="h-44"></div>
                <a href="https://wa.me/559294868342?text=Olá!%20Quero%20saber%20mais%20sobre%20suas%20ofertas!" target="_blank" class="transition-all hover:text-green-500 flex items-center gap-2 text-xl font-bold ml-5">
                    <Icon icon="logos:whatsapp-icon" />
                    Fale Conosco!
                </a>
            </div>
        </div>
    </div>
    <footer>
        <div class="container mx-auto flex items-center justify-center h-16">
            <div class="text-white">
                <p>Deluxe Cases - CNPJ 17.821.544/0001-17 | Av. Paraiba, 721 - Loja 3 - Posto Shell - Adrianópolis, Manaus - AM, 69057-021</p>
            </div>
        </div>
        
    </footer>
</div>



<style lang="postcss">
    .linha-maior {
        line-height: 4rem;
    }
    .bg-image {
        background-image: url('/landing_page.png');
        background-size: cover;
        /* background-position: center; */
    }
  .image-container {
    position: relative;
    @apply h-14;
  }

  .image-container img {
  }

  .glow-effect {
    @apply rounded-xl;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.1), rgba(0, 255, 255, 0.1));
    pointer-events: none;
    transition: opacity 0.3s;
    opacity: 0;
  }
</style>
