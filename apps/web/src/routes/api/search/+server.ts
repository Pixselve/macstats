import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";

import type {Restaurant} from "mcdonads-fetcher";

export const GET = (async ({url}) => {
    const search = url.searchParams.get('q');

    const typedRestaurants = (await import('../../../../../../generated/restaurants.json')).default as Restaurant[];

    if (search) {
        const results = typedRestaurants.filter((restaurant) => restaurant.properties.address.city.toLowerCase().includes(search.toLowerCase()));
        const cities = results.map((restaurant) => restaurant.properties.address.city);
        const uniqueCities = [...new Set(cities)];



        return json(
            {
                results: uniqueCities
            }
        )
    }

    return json(
        {
            results: []
        }
    )

}) satisfies RequestHandler;
