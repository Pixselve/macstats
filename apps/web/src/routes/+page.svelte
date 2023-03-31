<script lang="ts">
    import type {PageData} from './$types';
    import {Bar} from 'svelte-chartjs';
    import {BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from 'chart.js';
    import Card from "$lib/Card.svelte";
    import top_expensive_city from "../../../../generated/processed/top_cities_expensive.json";
    import top_cities_expensive from "../../../../generated/processed/top_cities_expensive.json";

    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
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
                        <span class="capitalize font-bold">{city.city.toLowerCase()}</span> <span class="text-black/50">{city.price} €</span>
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
                        <span class="capitalize font-bold">{city.city.toLowerCase()}</span> <span class="text-black/50">{city.price} €</span>
                    </div>

                </li>
            {/each}
        </ul>

    </Card>

    <Card className="md:col-span-2">
        <div class="text-sm text-slate-400">
            Répartition du prix du Big Mac 📊
        </div>
        <Bar
                data={{
                    labels: data.big_mac_price_distribution.prices,
                    datasets: [
                        {
                            label: 'Répartition du prix du Big Mac',


                            data: data.big_mac_price_distribution.amounts_of_restaurant,
                        }
                    ],
                }}
                options={{ responsive: true }}
        />
    </Card>
</div>





