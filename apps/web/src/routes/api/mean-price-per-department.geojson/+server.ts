export let prerender = true;

import type { RequestHandler } from './$types';
import departments from './departements.json';
import { getRestaurantWithPrice } from '$lib/getRestaurantWithPrice';
import type { Restaurant } from 'mcdonads-fetcher';
import { json } from '@sveltejs/kit';
import type { RestaurantWithPrice } from '$lib/getRestaurantWithPrice';
import chroma from 'chroma-js';

export const GET = (async ({ url }) => {
  const restaurantsWithPrice = await getRestaurantWithPrice();

  // group by department
  const restaurantsByDepartment = restaurantsWithPrice.reduce((acc, restaurant) => {
    const departmentCode = getDepartmentCodeFromRestaurant(restaurant);
    if (!acc[departmentCode]) {
      acc[departmentCode] = [];
    }
    acc[departmentCode].push(restaurant);
    return acc;
  }, {} as Record<string, RestaurantWithPrice[]>);
  // calculate mean price
  const meanPriceByDepartment = Object.entries(restaurantsByDepartment).reduce(
    (acc, [departmentCode, restaurants]) => {
      const meanPrice =
        restaurants.reduce((acc, restaurant) => acc + restaurant.price, 0) / restaurants.length;
      acc[departmentCode] = meanPrice;
      return acc;
    },
    {} as Record<string, number>
  );

    // get the min and max price
    const minPrice = Math.min(...Object.values(meanPriceByDepartment));
    const maxPrice = Math.max(...Object.values(meanPriceByDepartment));

  // add the mean price to the department
  const departmentsWithMeanPrice = departments.features.map((department) => {
    const departmentCode = department.properties.code;
    const meanPrice = meanPriceByDepartment[departmentCode];
    // set a hex color based on the mean price
    const colorScale = chroma.scale(['#30b719', '#e32323']).domain([minPrice, maxPrice]);
    const color = colorScale(meanPrice).hex();

    return {
      ...department,
      properties: {
        ...department.properties,
        meanPrice: (meanPrice / 100).toFixed(2) ?? 0,
        color
      }
    };
  });

  return json({
    type: 'FeatureCollection',
    features: departmentsWithMeanPrice
  });
}) satisfies RequestHandler;

function getDepartmentCode(postalCode: string): string {
  return postalCode.substring(0, 2);
}

/**
 * Get the department code from a restaurant
 * @param restaurant The restaurant
 */
function getDepartmentCodeFromRestaurant(restaurant: Restaurant): string {
  const postalCode = restaurant.properties.user_properties.displayPostCode;
  return getDepartmentCode(postalCode);
}
