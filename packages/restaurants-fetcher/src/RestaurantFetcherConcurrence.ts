import fs from "fs";
import {PropertiesConcurrents} from "./types/restaurantsConcurrents.type";
import {RechercheEntreprises} from "./recherche-entreprises";
import {Presets, SingleBar} from "cli-progress";
import {Feature} from "./types/getRestaurants.types";
import {Concurrents} from "./types/output";

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
    static saveFile(path: string, restaurants: Concurrents[]) {
        fs.writeFileSync(path, JSON.stringify(restaurants))
    }
    static async addConcurrence(features: Feature[]): Promise<Concurrents[]> {
        let bar = new SingleBar({
            format: "[{bar}] {value}/{total} | duration {duration_formatted} | ETA {eta_formatted} | {name}"
        }, Presets.legacy)

        bar.start(features.length, 0)
        let i = 0
        let errored = []
        let concurrents = []
        for (const f of features) {
            try{
                bar.update(i, {
                    name: features[i].properties.name,
                })
                let properties = f.properties as PropertiesConcurrents
                let lat = properties.user_properties.y
                let long = properties.user_properties.x
                let numberConcurrents = await RechercheEntreprises.countNear(lat, long)
                concurrents.push({
                    store_id: properties.store_id,
                    number_concurrents: numberConcurrents
                })
                await delay(500)
            }catch (e){
                console.error(`Error on ${i}: ${e}`)
                errored.push(i)
            }finally {
                i++
            }
        }
        bar.stop()

        if(errored.length !== 0)
            console.error(`Errored: ${errored.length}`)

        return concurrents
    }
}