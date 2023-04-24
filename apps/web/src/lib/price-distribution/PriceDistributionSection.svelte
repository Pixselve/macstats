<script>
    import {Bar} from "svelte-chartjs";
    import Card from "$lib/Card.svelte";

    export let prices = [];
    export let amounts_of_restaurant = [];
    let chartData = {
        labels: prices,
        datasets: [
            {
                label: 'Répartition du prix du Big Mac',
                data: amounts_of_restaurant,
            }
        ],
    }
</script>
<Card className="md:col-span-2 space-y-4">
    <div class="text-sm text-slate-400">
        Répartition du prix du Big Mac
    </div>
    <Bar
            data={chartData}
            options={{ responsive: true }}
    />
</Card>
