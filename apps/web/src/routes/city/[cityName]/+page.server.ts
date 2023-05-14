import type {PageServerLoad} from './$types';
import type {Restaurant} from 'mcdonads-fetcher';
import {readFile} from "fs/promises";
import type {RestaurantWithPrice} from "$lib/getRestaurantWithPrice";
import {getBigMacPrice} from "$lib/getRestaurantWithPrice";
import restaurants from "../../../../../../generated/restaurants.json";

async function getCityImageFromWikipedia(city: string) {
    try {
        // search for the city page on wikipedia fr api
        const wikiSearch = await fetch(
            `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${city}&utf8=&format=json`
        );
        const wikiSearchJson = await wikiSearch.json();
        const wikiSearchPageId = wikiSearchJson.query.search[0].pageid;
        // get the page image
        const wikiPageImage = await fetch(
            `https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${wikiSearchPageId}`
        );
        const wikiPageImageJson = await wikiPageImage.json();
        return wikiPageImageJson.query.pages[wikiSearchPageId].original.source;
    } catch (e) {
        // if the city is not found on wikipedia, we return a default image
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/NYC_wideangle_south_from_Top_of_the_Rock.jpg/2560px-NYC_wideangle_south_from_Top_of_the_Rock.jpg';
    }
}

async function meanBigMacPriceForCity(city: string) {
    const restaurantsForCity = (restaurants as Restaurant[]).filter(
        (restaurant) => restaurant.properties.address.city === city
    );

    const restaurantsWithPrice: RestaurantWithPrice[] = [];
    for (const restaurant of restaurantsForCity) {
        try {
            const price = await getBigMacPrice(restaurant.properties.store_id);
            restaurantsWithPrice.push({...restaurant, price});

        } catch (e) {
            console.log(`Restaurant ${restaurant.properties.name} doesn't have a Big Mac`);
        }
    }

    const meanPrice = restaurantsWithPrice.reduce((acc, restaurant) => acc + restaurant.price, 0) / restaurantsWithPrice.length;
    const formattedPrice = (meanPrice / 100).toFixed(2);

    return {
        meanPrice: formattedPrice,
        amountOfRestaurants: restaurantsWithPrice.length,
    };


}

export const load = (async ({params}) => {
    const city = params.cityName;
    const image = await getCityImageFromWikipedia(city);
    const capitalCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    const {meanPrice, amountOfRestaurants} = await meanBigMacPriceForCity(city);

    return {
        image: image,
        title: capitalCity,
        meanPrice: meanPrice,
        amountOfRestaurants
    };
}) satisfies PageServerLoad;
