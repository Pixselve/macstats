<script lang="ts">
    import restaurantData from 'mcdonalds-api';
    import {Bar} from 'svelte-chartjs';
    import {browser} from '$app/environment';
    import {BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from 'chart.js';
    import {onDestroy, onMount} from "svelte";
    import Card from "$lib/Card.svelte";

    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    Chart.defaults.color = '#000';
    Chart.defaults.backgroundColor = '#27742d';


    let mapElement;
    let map;

    onMount(async () => {
        if (browser) {
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView([48.92309, 2.25481], 6);


            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            const computeColor = (price, minPrice, maxPrice) => {
                const ratio = (price - minPrice) / (maxPrice - minPrice);
                const r = Math.round(255 * ratio);
                const g = Math.round(255 * (1 - ratio));
                const b = 0;
                return `rgb(${r}, ${g}, ${b})`;
            }

            restaurantData.priceByRestaurant.forEach(restaurant => {
                leaflet.circleMarker([restaurant.y as number, restaurant.x as number], {
                    radius: 5,
                    fillColor: computeColor(restaurant.price, restaurantData.minRestaurant.price, restaurantData.maxRestaurant.price),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map)
                    .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.price} €`);
            });
        }
    });

    onDestroy(async () => {
        if (map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });


</script>

<style>
    @import 'leaflet/dist/leaflet.css';
</style>

<Card>
    <h1 class="font-bold text-xl sm:text-3xl">🍔 Le BigMac dans {restaurantData.restaurantCount} restaurants en 🇫🇷</h1>
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-sm">😁 Prix le moins bas</h2>
            <h1 class="font-bold text-xl capitalize">{restaurantData.minRestaurant.price.toFixed(2)} €</h1>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-sm">🤔 Prix moyen</h2>
            <h1 class="font-bold text-xl capitalize">{restaurantData.meanPrice} €</h1>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-sm">😡 Prix le plus haut</h2>
            <h1 class="font-bold text-xl capitalize">{restaurantData.maxRestaurant.price.toFixed(2)} €</h1>
        </div>
    </div>
</Card>


<Card>
    <h1 class="font-bold text-xl sm:text-3xl">🍔 Répartition des prix</h1>

    <Bar
            data={{
                labels: restaurantData.restaurantCountByPrice.labels,
			datasets: [
				{
					label: 'Nombre de restaurants',
					data: restaurantData.restaurantCountByPrice.data
				}
			]
		}}
            options={{ responsive: true }}
    />
</Card>

<Card className="aspect-square">
    <h1 class="font-bold text-xl sm:text-3xl">🍔 Répartition sur la 🇫🇷</h1>
    <div bind:this={mapElement} id="map" class="w-full h-full"></div>
</Card>
