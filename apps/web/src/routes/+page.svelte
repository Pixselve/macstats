<script lang="ts">
    import type {PageData} from './$types';
    import {Bar, Scatter} from 'svelte-chartjs';
    import {
        BarElement,
        CategoryScale,
        Chart,
        Legend,
        LinearScale,
        Title,
        Tooltip,
        PointElement,
        LineElement
    } from 'chart.js';
    import Card from "$lib/Card.svelte";
    import StandardOfLivingSection from "$lib/standard-of-living/StandardOfLivingSection.svelte";
    import PriceDistributionSection from "$lib/price-distribution/PriceDistributionSection.svelte";
    import CompetitorMapSection from "$lib/competitors/CompetitorMapSection.svelte";
    import number_of_competitors_to_price from "../../../../generated/processed/number_of_competitors_to_price.json";

    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);
    Chart.defaults.color = '#000';
    Chart.defaults.backgroundColor = '#27742d';

    export let data: PageData;


</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="space-y-4">
        <div class="text-sm text-slate-400">
            Villes où le Big Mac est le plus cher 🫰
        </div>
        <ul class="list-decimal ml-5">
            {#each data.top_cities_expensive as city}
                <li class="w-full">
                    <div class="flex items-baseline justify-between gap-2">
                        <span class="capitalize font-bold">{city.city.toLowerCase()}</span> <span
                            class="text-black/50">{city.price} €</span>
                    </div>

                </li>
            {/each}
        </ul>

    </Card>

    <Card className="space-y-4">
        <div class="text-sm text-slate-400">
            Villes où le Big Mac est le moins cher 🤑
        </div>
        <ul class="list-decimal ml-5">
            {#each data.top_cities_cheapest as city}
                <li class="w-full">
                    <div class="flex items-baseline justify-between gap-2">
                        <span class="capitalize font-bold">{city.city.toLowerCase()}</span> <span
                            class="text-black/50">{city.price} €</span>
                    </div>

                </li>
            {/each}
        </ul>

    </Card>

    <PriceDistributionSection prices={data.big_mac_price_distribution.prices} amounts_of_restaurant={data.big_mac_price_distribution.amounts_of_restaurant}></PriceDistributionSection>
    <StandardOfLivingSection trendlinePointsData={data.standardOfLiving.trendline} R2={data.standardOfLiving.r2}
                             plotPointsData={data.standardOfLiving.prices}></StandardOfLivingSection>
    <CompetitorMapSection R2={data.competitors.r2} trendlinePointsData={data.competitors.trendline} plotPointsData={data.competitors.number_of_competitors_to_price}></CompetitorMapSection>
</div>





