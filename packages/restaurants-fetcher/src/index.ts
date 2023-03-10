import {RechercheEntreprises} from "./recherche-entreprises";
import {Restaurants} from "./types/getRestaurants.types";
import {PropertiesConcurrents} from "./types/restaurantsConcurrents.type";
import * as fs from 'fs';
import * as process from "process";
import * as path from "path";

(async () => {
    let args = process.argv.slice(2)
    console.log(args)
})()

function showHelp(): string{
    let program = path.basename(process.argv[1])
    return `Usage : ${program} [input_file.json] [output_file.json]`
}

class RestaurantFetcherConcurence {
    openFile(path: string): Restaurants {
        try {
            let res = JSON.parse(fs.readFileSync(path).toString()) as Restaurants
            if(res === null)
                throw "File is not of Restaurant format"
            return res
        } catch (e: any) {
            if(e.code === 'ENOENT')
                throw `File ${path} not found`
            throw "Failed to open file"
        }

    }
    saveFile(path: string, restaurants: Restaurants) {
        fs.writeFileSync(path, JSON.stringify(restaurants))
    }
    async addConcurrence(restaurants: Restaurants): Promise<Restaurants> {
        let features = restaurants.features
        for (const f of features) {
            let properties = f.properties as PropertiesConcurrents
            let lat = properties.user_properties.y
            let long = properties.user_properties.x
            properties.nombreConcurrents = await RechercheEntreprises.countNear(lat, long)
        }
        return restaurants
    }
}