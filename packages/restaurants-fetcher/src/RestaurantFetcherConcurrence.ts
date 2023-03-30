import fs from "fs";
import {PropertiesConcurrents} from "./types/restaurantsConcurrents.type";
import {RechercheEntreprises} from "./recherche-entreprises";
import {Presets, SingleBar} from "cli-progress";
import {Feature} from "./types/getRestaurants.types";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export class RestaurantFetcherConcurrence {
    static openFile(path: string): Feature[] {
        try {
            let res = JSON.parse(fs.readFileSync(path).toString()) as Feature[]
            if(res === null)
                throw "File is not of Restaurant format"
            return res
        } catch (e: any) {
            if(e.code === 'ENOENT')
                throw `File ${path} not found`
            throw "Failed to open file"
        }

    }
    static saveFile(path: string, restaurants: Feature[]) {
        fs.writeFileSync(path, JSON.stringify(restaurants))
    }
    static async addConcurrence(features: Feature[]): Promise<Feature[]> {
        let bar = new SingleBar({
            format: "[{bar}] {value}/{total} | duration {duration} | ETA {eta_formatted} | {name}"
        }, Presets.legacy)

        bar.start(features.length, 0)
        let i = 0
        for (const f of features) {
            bar.update(i, {
                name: features[i].properties.name,
            })
            let properties = f.properties as PropertiesConcurrents
            let lat = properties.user_properties.y
            let long = properties.user_properties.x
            properties.nombreConcurrents = await RechercheEntreprises.countNear(lat, long)
            i++
            await delay(500)
        }
        return features
    }
}