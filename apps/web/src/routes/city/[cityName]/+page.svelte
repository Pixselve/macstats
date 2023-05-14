<script lang="ts">
    import type { PageData } from './$types'
    export let data: PageData
</script>

<a href="/" class="btn gap-2">
    <svg class="h-6 fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
    <span>Retour à l'accueil</span>
</a>

<header class="relative rounded-xl overflow-hidden">
    <div class="absolute w-full h-full z-10 bg-gradient-to-b from-transparent to-black/50 p-4 flex items-end">
        <h1 class="text-7xl font-bold text-white">{data.title}</h1>
    </div>
    <img class="w-full object-cover h-60" src={data.image} alt={data.title}>

</header>



<main>
    <div class="stats shadow w-full">

        <div class="stat">
            <div class="stat-title">Prix moyen du BigMac</div>
            <div class="stat-value text-secondary">{data.meanPrice}€</div>
        </div>

        <div class="stat">
            <div class="stat-title">Nombre de restaurant McDonald's</div>
            <div class="stat-value text-secondary">{data.amountOfRestaurants}</div>
        </div>

    </div>
</main>

