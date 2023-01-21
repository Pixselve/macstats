import {Feature, Restaurants} from "./getRestaurants.types";
import * as fs from "fs";
import {Product} from "./product.type";
import {SingleBar, Presets} from "cli-progress";

const KEY = "woos-77bec2e5-8f40-35ba-b483-67df0d5401be";

const fetchRestaurantsFromApi = async (page: number): Promise<Restaurants> => {
    const res = await fetch(`https://api.woosmap.com/stores?key=${KEY}&page=${page}`, {
        headers: {
            "Origin": "https://www.mcdonalds.fr"
        }
    }).then((res) => res.json());
    return res;
}
const fetchAllRestaurantsFromApi = async (): Promise<Feature[]> => {
    const restaurants: Feature[] = [];
    let page = 1;
    let res = await fetchRestaurantsFromApi(page);
    restaurants.push(...res.features);
    while (res.pagination.page < res.pagination.pageCount) {
        restaurants.push(...res.features);
        page++;
        res = await fetchRestaurantsFromApi(page);
    }
    return restaurants;
}

const fetchBurgersFromOneRestaurant = async (restaurantID: number): Promise<Product[]> => {
    return await fetch(`https://ws.mcdonalds.fr/api/catalog/14/products?eatType=EAT_IN&responseGroups=RG.PRODUCT.DEFAULT&responseGroups=RG.PRODUCT.WORKING_HOURS&responseGroups=RG.PRODUCT.PICTURES&responseGroups=RG.PRODUCT.RESTAURANT_STATUS&restaurantRef=${restaurantID}`, {
        headers: {
            "Origin": "https://www.mcdonalds.fr"
        }
    }).then((res) => res.json());
}


const fetchAllRestaurantsFromApiAndSave = async (): Promise<void> => {
    const restaurants = await fetchAllRestaurantsFromApi();
    // save to file "restaurants.json"
    fs.writeFile("data/restaurants.json", JSON.stringify(restaurants), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const getAllRestaurantsCache = async (): Promise<Feature[]> => {
    // read from file "restaurants.json"
    const restaurants = await fs.promises.readFile("data/restaurants.json", "utf-8");
    return JSON.parse(restaurants);
}

const fetchBurgersFromOneRestaurantAndSave = async (restaurantID: number): Promise<void> => {
    const burgers = await fetchBurgersFromOneRestaurant(restaurantID);
    // save to file "burgers.json"
    fs.writeFile(`data/burgers/${restaurantID}.json`, JSON.stringify(burgers), (err) => {
        if (err) {
            console.log(err);
        }
    });
}


const getAllRestaurantsFromCacheAndFetchBurgers = async (): Promise<void> => {
    const restaurants = await getAllRestaurantsCache();
    console.log(`⚙️ Loaded ${restaurants.length} restaurants`)
    let result: { id: number, products: Product[] }[] = [];
    // for each restaurant
    const bar = new SingleBar({}, Presets.shades_classic);
    bar.start(restaurants.length, 0);
    for (const restaurant of restaurants) {
        // fetch burgers
        try {
            const burgers = await fetchBurgersFromOneRestaurant(+restaurant.properties.store_id);
            result.push({
                id: +restaurant.properties.store_id,
                products: burgers
            });

        } catch (e) {
            console.error(`❌ Error fetching burgers for restaurant ${restaurant.properties.store_id} (${restaurant.properties.name})`);
        } finally {
            bar.increment();
        }
    }
    bar.stop();
    // save to file /data/burgers.json
    fs.writeFileSync("data/burgers.json", JSON.stringify(result));

}
const transformRestaurants = async (): Promise<void> => {
    const restaurants = await getAllRestaurantsCache();
    console.log(`⚙️ Loaded ${restaurants.length} restaurants`)
    const restaurantsIDsAndNames = restaurants.map((restaurant) => ({
        id: restaurant.properties.store_id,
        name: restaurant.properties.name,
        x: restaurant.geometry.coordinates[0],
        y: restaurant.geometry.coordinates[1]
    }));
    fs.writeFileSync("data/restaurantsIDsAndNames.json", JSON.stringify(restaurantsIDsAndNames));
}

// transformRestaurants();
const associateBigMacPriceToRestaurant = async (): Promise<void> => {
    // read burgers.json file
    const burgers = await fs.promises.readFile("data/burgers.json", "utf-8");
    const burgersParsed: { id: number, products: Product[] }[] = JSON.parse(burgers);
    // read restaurantsIDsAndNames.json file
    const restaurantsIDsAndNames = await fs.promises.readFile("data/restaurantsIDsAndNames.json", "utf-8");
    const restaurantsIDsAndNamesParsed = JSON.parse(restaurantsIDsAndNames);
    let result: { id: number, name: string, price: number, x: number, y: number }[] = [];
    // for each restaurant
    for (const restaurant of burgersParsed) {
        // find big mac
        const bigMac = restaurant.products.find((product: Product) => product.ref === "2040");
        // find restaurant in restaurantsIDsAndNames
        const restaurantName = restaurantsIDsAndNamesParsed.find((restaurantSearch: { id: string }) => restaurant.id === +restaurantSearch.id);
        // add price to restaurant
        if (!bigMac) {
            console.log(`❌ No big mac found for restaurant ${restaurant.id}`);
            continue;
        }
        if (!restaurantName) {
            console.log(`❌ No restaurant found for restaurant ${restaurant.id}`);
            continue;
        }
        // restaurantName.y and restaurantName.x use geojson format
        // https://geojson.org/
        result.push({
            id: restaurant.id,
            name: restaurantName.name,
            price: bigMac.price / 100,
            x: restaurantName.x,
            y: restaurantName.y
        });
    }


    const minRestaurant = result.reduce((prev, current) => (prev.price < current.price) ? prev : current);
    const maxRestaurant = result.reduce((prev, current) => (prev.price > current.price) ? prev : current);
    const meanPrice = (result.reduce((prev, current) => prev + current.price, 0) / result.length).toFixed(2)
    const restaurantCount = result.length;
    const updatedAt = new Date().toISOString();

    const restaurantCountByPrice = result.reduce((prev, current) => {
        const price = current.price.toFixed(2);
        if (prev[price]) {
            prev[price]++;
        } else {
            prev[price] = 1;
        }
        return prev;
    }, {} as { [key: string]: number });

    let labels = Object.keys(restaurantCountByPrice);
    let data = Object.values(restaurantCountByPrice);

    // sort by price
    labels = labels.sort((a, b) => +a - +b);
    data = labels.map((label) => restaurantCountByPrice[label]);

    fs.writeFileSync("src/statistics.json", JSON.stringify({
            minRestaurant,
            maxRestaurant,
            meanPrice,
            restaurantCount,
            updatedAt,
            restaurantCountByPrice: {
                labels,
                data
            },
            priceByRestaurant: result
        }
    ));
}

associateBigMacPriceToRestaurant();
