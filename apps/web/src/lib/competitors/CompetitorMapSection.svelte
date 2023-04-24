<script>
import Card from "$lib/Card.svelte";
import {Scatter} from "svelte-chartjs";

export let trendlinePointsData = [];
export let plotPointsData = [];

export let R2 = 0;

let chartData = {
    datasets: [
        {
            label: 'Prix du Big Mac selon le nombre de concurrents',
            data: plotPointsData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 5,
            lineTension: 0,
            fill: false,
            order: 1
        },
        {
            label: 'Courbe de régression',
            data: trendlinePointsData,
            showLine: true,
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            pointRadius: 0, // Set point radius to 0 to hide the points
        },
    ],
}
</script>

<Card className="md:col-span-2 space-y-4">
    <div class="text-sm text-slate-400">
        La concurrence des restaurants McDonald's
    </div>

    <Scatter
            data={chartData}
            options={{ responsive: true }}
    />

    <div class="alert alert-info shadow-lg">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Le prix du burger n'est pas lié au nombre de concurrent à proximité (R2 = {R2}).</span>
        </div>
    </div>
</Card>
