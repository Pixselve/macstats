// read json file
import { readFile } from "fs/promises";

const BUGERS_DIR = '../../generated/burgers';


const restaurants: any[] = await readFile("../../generated/restaurants.json", "utf-8").then((file) => JSON.parse(file));


export async function getBigMacPrice(id: string): Promise<any> {
    const file = await readFile(`${BUGERS_DIR}/${id}.json`, 'utf-8');
    const json = JSON.parse(file);
    const burger = json.find((burger) => burger.ref === '2040');
    if (!burger) {
        throw new Error('Big Mac not found');
    }
    return burger.price;
}


// associate a price to a restaurant
const restaurantsWithPrice = [];
for (const restaurant of restaurants) {
    try {
        const price = await getBigMacPrice(restaurant.properties.store_id) / 100;
        // only keep the properties we need
        restaurantsWithPrice.push({
            price,
            address: restaurant.properties.address,
        });

    } catch (e) {
        console.log(`Restaurant ${restaurant.properties.name} doesn't have a Big Mac`);
    }
}

// write json file
import { writeFile } from "fs/promises";

await writeFile("../../generated/processed/restaurantsWithPrice.json", JSON.stringify(restaurantsWithPrice, null, 2), "utf-8");
