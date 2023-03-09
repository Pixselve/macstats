export interface Product {
    type: string
    ref: string
    label: string
    designation: string
    description: string
    marketingGroup: string
    pictures: Picture[]
    available: boolean
    eligible: boolean
    price: number
    foodType: string
    soda: boolean
    orderableToZero: boolean
    delivery: boolean
    nutriscore: string
    specificNutritionalCalculation: boolean
    workingHoursRefs: string[]
    loyaltyMarketingGroup: string
    permanent: boolean
    depositContenants: string[]
    canAdd: boolean
    cgi: boolean
}

export interface Picture {
    id: number
    ref: string
    label: string
    url: string
    activationDate: string
    types: string[]
    expirationDate?: string
}
