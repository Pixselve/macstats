import type { PageServerLoad } from "./$types";
import top_cities_expensive from "../../../../generated/processed/top_cities_expensive.json";
import top_cities_cheapest from "../../../../generated/processed/top_cities_cheapest.json";
import big_mac_price_distribution from "../../../../generated/processed/big_mac_price_distribution.json";
export const load = (async ({ params }) => {

    const sortedDistribution = big_mac_price_distribution.sort((a, b) => a.price - b.price);


    return {
        top_cities_expensive,
        top_cities_cheapest,
        big_mac_price_distribution: {
            prices: sortedDistribution.map(d => d.price),
            amounts_of_restaurant: sortedDistribution.map(d => d.amount_of_restaurant)
        }
    }
}) satisfies PageServerLoad;
