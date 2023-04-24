<script lang="ts">
    import Card from "$lib/Card.svelte";
    import maplibre from 'maplibre-gl';
    import {onMount} from "svelte";

    const {Map, Popup} = maplibre;

    let mapContainer;
    let map;

    export let geojson;
    const popup = new Popup({
        closeButton: false,
        closeOnClick: false
    });


    function getColor(price) {
        return price > 6 ? '#800026' :
            price > 5 ? '#BD0026' :
                price > 4 ? '#E31A1C' :
                    price > 3 ? '#FC4E2A' :
                        price > 2 ? '#FD8D3C' :
                            price > 1 ? '#FEB24C' :
                                '#FFEDA0';
    }

    onMount(() => {
        map = new Map({
            container: mapContainer,
            style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
            center: [2.213749, 46.227638], // starting position [lng, lat]
            zoom: 5, // starting zoom
            maplibreLogo: false,
        });

        map.on('load', function () {
            map.addSource('departments', {
                'type': 'geojson',
                'data': "http://localhost:5173/api/mean-price-per-department.geojson"
            });

            map.addLayer({
                id: 'departments',
                type: 'fill',
                source: 'departments',
                paint: {
                    'fill-color': ['get', 'color'],
                    'fill-opacity': 0.7
                }
            });
        } );




        // Add event listeners for interactivity
        map.on('mousemove', 'departments', (e) => {
            map.getCanvas().style.cursor = 'pointer';

            const deptName = e.features[0].properties.nom;
            const bigMacPrice = e.features[0].properties.meanPrice;

            // Display the department name and Big Mac price in a popup
            popup
                .setLngLat(e.lngLat)
                .setHTML(`<strong>${deptName}</strong><br/>Big Mac Price: ${bigMacPrice}€`)
                .addTo(map);


        });

        map.on('mouseleave', 'departments', () => {
            map.getCanvas().style.cursor = '';
            map.getCanvas().style.cursor = 'default';
            // remove the popup
            popup.remove();
        });
    })




</script>

<Card className="md:col-span-2 space-y-4">
    <div class="text-sm text-slate-400">
        Prix moyen du Big Mac par département
    </div>
    <div bind:this={mapContainer} id="map" class="aspect-square"></div>
</Card>
