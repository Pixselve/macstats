export class DataGouvApi {
    url = "https://recherche-entreprises.api.gouv.fr"
    radius = .5 // in kilometers

    private async near_point(lat: number, long: number, radius: number, page: number) {
        let code_naf = '56.10C'

        let data = await fetch(`${this.url}/near_point?lat=${lat}&long=${long}&radius=${radius}&activite_principale=${code_naf}&section_activite_principale=I&limite_matching_etablissements=100&page=${page}&per_page=25`)
            .catch(e => {
                throw "Near point api error : " + e
            })
        return data
    }
    private async getNear(lat: number, long: number){
        let firstPage = await this.near_point(lat, long, this.radius, 1)

    }
}