import {RechercheEntreprises} from "./recherche-entreprises";

(async () => {
    let res = await RechercheEntreprises.getNear(48.114701, -1.622049)
    console.log(res.map(e => e.nom_complet + ' ' + e.siren))
})()