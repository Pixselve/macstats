import { readFile } from 'fs/promises';
import type { Restaurant, Burger } from 'mcdonads-fetcher';

export type RestaurantWithPrice = Restaurant & { price: number };

export async function getRestaurantWithPrice(): Promise<RestaurantWithPrice[]> {
    const restaurants: Restaurant[] = await readFile('../../generated/restaurants.json', 'utf-8').then((file) => JSON.parse(file));

    // associate a price to a restaurant
    // the function getBigMacPrice can throw when the restaurant doesn't have a Big Mac
    // in that case, we want to remove the restaurant from the list
    const restaurantsWithPrice: RestaurantWithPrice[] = [];
    for (const restaurant of restaurants) {
        try {
            const price = await getBigMacPrice(restaurant.properties.store_id);
            restaurantsWithPrice.push({ ...restaurant, price });

        } catch (e) {
            console.log(`Restaurant ${restaurant.properties.name} doesn't have a Big Mac`);
        }
    }
    return restaurantsWithPrice;
}

const BUGERS_DIR = '../../generated/burgers';

export async function getBigMacPrice(id: string): Promise<any> {
  const file = await readFile(`${BUGERS_DIR}/${id}.json`, 'utf-8');
  const json: Burger[] = JSON.parse(file);
  const burger = json.find((burger) => burger.ref === '2040');
  if (!burger) {
    throw new Error('Big Mac not found');
  }
  return burger.price;
}
