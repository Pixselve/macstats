<script>
    import '../app.postcss';
    import {MetaTags} from "svelte-meta-tags";
    import SearchBar from "$lib/SearchBar.svelte";
    import Footer from "$lib/Footer.svelte";


</script>

<MetaTags title="MacStats - La statistique du BigMac"
          description="MacStats est un site dédié à la collecte et à la diffusion des informations sur le prix du Big Mac en France métropolitaine. Il propose une base de données mise à jour régulièrement avec les tarifs du fameux sandwich de McDonald's dans différentes régions de France."
          openGraph={{
               url: 'https://macstats.mael.app',
                title: 'MacStats - La statistique du BigMac',
                description: "MacStats est un site dédié à la collecte et à la diffusion des informations sur le prix du Big Mac en France métropolitaine. Il propose une base de données mise à jour régulièrement avec les tarifs du fameux sandwich de McDonald's dans différentes régions de France.",
                images: [
                    {
                        url: 'https://macstats.mael.app/og-image.png',
                        width: 800,
                        height: 600,
                        alt: 'MacStats - La statistique du BigMac',
                    },
                ],
          }}
/>


<main class="max-w-5xl m-auto p-2 sm:p-4 space-y-4 sm:space-y-10">
    <nav class="flex justify-between sm:items-end flex-col sm:flex-row space-y-4 sm:space-y-0">
        <h1 class="font-bold text-3xl sm:text-5xl space-x-2"><span
                class="bg-secondary p-2 rounded-md text-primary">Mac</span><span>Stats</span></h1>
        <span class="font-bold text-black/70">Mis à jour le 21 janvier 2022</span>
    </nav>

    <SearchBar></SearchBar>

    <slot/>
    <Footer></Footer>
</main>

