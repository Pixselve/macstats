import {Entreprise, NearResponse} from "./types/api-recherche-entreprises.types";

export class RechercheEntreprises {
    static url = "https://recherche-entreprises.api.gouv.fr"
    static radius = .5 // in kilometers

    private static async near_point(lat: number, long: number, radius: number, page: number): Promise<NearResponse> {
        let code_naf = '56.10C'

        let res = await fetch(
            `${this.url}/near_point?lat=${lat}&long=${long}&radius=${radius}&activite_principale=${code_naf}&section_activite_principale=I&limite_matching_etablissements=100&page=${page}&per_page=25`
        ).catch(e => {
            throw "Error fetching API " + e.message
        })

        return await res.json() as NearResponse
    }
    public static async getNear(lat: number, long: number, radius = this.radius): Promise<Entreprise[]>{
        let list: Entreprise[] = []

        let result = await this.near_point(lat, long, this.radius, 1)
        list.push(...result.results)

        for(let i=2; i<result.total_pages; i++){
            let result = await this.near_point(lat, long, this.radius, i)
            list.push(...result.results)
        }

        return list;
    }
    public static async countNear(lat: number, long: number, radius = this.radius): Promise<number>{
        let result = await this.near_point(lat, long, this.radius, 1)
        return result.total_results
    }
}