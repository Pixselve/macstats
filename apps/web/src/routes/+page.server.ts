import type { PageServerLoad } from "./$types";
import top_cities_expensive from "../../../../generated/processed/top_cities_expensive.json";
import top_cities_cheapest from "../../../../generated/processed/top_cities_cheapest.json";
import big_mac_price_distribution from "../../../../generated/processed/big_mac_price_distribution.json";
import big_mac_price_med14 from "../../../../generated/processed/bigmac_price_med14.json";
export const load = (async ({ params }) => {

    const sortedDistribution = big_mac_price_distribution.sort((a, b) => a.price - b.price);

    const big_mac_price_med14_processed = big_mac_price_med14.map((d) => ({x: d.MED14, y: d.big_mac_price}))

    return {
        top_cities_expensive,
        top_cities_cheapest,
        big_mac_price_distribution: {
            prices: sortedDistribution.map(d => d.price),
            amounts_of_restaurant: sortedDistribution.map(d => d.amount_of_restaurant)
        },
        big_mac_price_med14_processed
    }
}) satisfies PageServerLoad;
