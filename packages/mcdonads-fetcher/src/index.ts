import { Feature, Properties, Restaurants } from './types/getRestaurants.types';
import { promises as fs, existsSync } from 'fs';
import ora from 'ora';
import pThrottle from 'p-throttle';
import { Product } from './types/product.type';

import cliProgress from 'cli-progress';

const throttle = pThrottle({
  limit: 2,
  interval: 1000
});

const ROOT_FOLDER = './';

/**
 * Throttle fetch to avoid 429
 */
const throttleFetch = throttle((input: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(input, init)
);

const KEY = 'woos-77bec2e5-8f40-35ba-b483-67df0d5401be';

const fetchRestaurantsLocations = async (page: number): Promise<Restaurants> => {
  return await throttleFetch(`https://api.woosmap.com/stores?key=${KEY}&page=${page}`, {
    headers: {
      Origin: 'https://www.mcdonalds.fr'
    }
  }).then((res) => res.json());
};

const fetchAllRestaurantsFromApi = async (): Promise<Feature[]> => {
  const restaurants: Feature[] = [];
  let page = 1;
  let res = await fetchRestaurantsLocations(page);
  restaurants.push(...res.features);
  for (let i = res.pagination.page + 1; i <= res.pagination.pageCount; i++) {
    await throttle(() => Promise.resolve());
    res = await fetchRestaurantsLocations(i);
    restaurants.push(...res.features);
  }
  return restaurants;
};

async function saveJson(fileName: string, data: string) {
  await fs.writeFile(ROOT_FOLDER + fileName, data);
}

/**
 * Fetch burgers from one restaurant
 * @param restaurantID restaurant ID
 * @returns {Promise<Product[]>}
 */
const fetchBurgersFromOneRestaurant = async (restaurantID: number): Promise<Product[]> => {
  return await throttleFetch(
    `https://ws.mcdonalds.fr/api/catalog/14/products?eatType=EAT_IN&responseGroups=RG.PRODUCT.DEFAULT&responseGroups=RG.PRODUCT.WORKING_HOURS&responseGroups=RG.PRODUCT.PICTURES&responseGroups=RG.PRODUCT.RESTAURANT_STATUS&restaurantRef=${restaurantID}`,
    {
      headers: {
        Origin: 'https://www.mcdonalds.fr'
      }
    }
  ).then((res) => res.json());
};

/**
 * Fetch burgers from all restaurants
 *
 * 1. Get all restaurants from JSON file
 * 2. For each restaurant: fetch burgers, save burgers in JSON file in burgers/${restaurantID}.json
 */
async function fetchAllBurgersFromAllRestaurants() {
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const restaurants = await fs.readFile(ROOT_FOLDER + 'restaurants.json', 'utf8').then((data) => JSON.parse(data));

  bar1.start(restaurants.length, 0);

  // create burgers folder
  if (!existsSync(ROOT_FOLDER + 'burgers')) {
    await fs.mkdir(ROOT_FOLDER + 'burgers');
  }


  for (const restaurant of restaurants) {
    await (async () => {
      const burgers = await fetchBurgersFromOneRestaurant(restaurant.properties.store_id);
      await saveJson(`burgers/${restaurant.properties.store_id}.json`, JSON.stringify(burgers));
      bar1.increment();
    })();
  }
  bar1.stop();
}

async function main() {
  const restaurantsSpinner = ora('Fetching restaurants').start();
  const restaurants = await fetchAllRestaurantsFromApi();
  await saveJson('restaurants.json', JSON.stringify(restaurants));
  restaurantsSpinner.succeed(`Fetched ${restaurants.length} restaurants`);

  await fetchAllBurgersFromAllRestaurants();
  console.log('Finished fetching burgers');
}

main();

export type { Feature as Restaurant, Product as Burger, Properties as RestaurantProperties };
