import {Feature, Restaurants} from "./types/getRestaurants.types";
import * as fs from "fs";

const KEY = "woos-77bec2e5-8f40-35ba-b483-67df0d5401be";

const fetchRestaurantsLocations = async (page: number): Promise<Restaurants> => {
    return await fetch(`https://api.woosmap.com/stores?key=${KEY}&page=${page}`, {
        headers: {
            "Origin": "https://www.mcdonalds.fr"
        }
    }).then((res) => res.json());
}

const fetchAllRestaurantsFromApi = async (): Promise<Feature[]> => {
    const restaurants: Feature[] = [];
    let page = 1;
    let res = await fetchRestaurantsLocations(page);
    restaurants.push(...res.features);
    while (res.pagination.page < res.pagination.pageCount) {
        restaurants.push(...res.features);
        page++;
        res = await fetchRestaurantsLocations(page);
    }
    return restaurants;
}

function saveJson(fileName: string, data: string) {
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

async function main() {
    console.log("Fetching restaurants from API...")
    const restaurants = await fetchAllRestaurantsFromApi();
    console.log("Done fetching restaurants from API.")
    console.log("Restaurants count: ", restaurants.length);


}

main();
