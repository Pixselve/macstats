export interface Restaurants {
    type: string
    features: Feature[]
    pagination: Pagination
}

export interface Feature {
    type: string
    properties: Properties
    geometry: Geometry
}

export interface Properties {
    store_id: string
    name: string
    contact: Contact
    address: Address
    user_properties: UserProperties
    tags: string[]
    types: string[]
    last_updated: string
    open: Open
    weekly_opening: WeeklyOpening
    opening_hours: OpeningHours
}

export interface Contact {
    email: any
    phone: string
    website: string
}

export interface Address {
    lines: string[]
    country_code: string
    city: string
    zipcode?: string
}

export interface UserProperties {
    x: any
    y: any
    fax: string
    num: string
    web: string
    icon: string
    name: string
    email?: string
    info1: string
    info2: string
    info3: string
    info4: string
    info5: string
    info6: string
    info7: string
    info8?: string
    info9: string
    meta1?: string
    meta2: string
    meta3: string
    meta4: string
    meta5: string
    meta6?: string
    meta7: string
    meta8?: string
    meta9?: string
    phone: string
    info10: string
    info11: string
    info28: string
    info29: string
    info30: string
    info31: string
    info32: string
    info33: string
    info34: string
    info35: string
    info36: string
    meta10?: string
    meta11: string
    meta12: string
    meta13: string
    meta14?: string
    meta15?: string
    meta16: string
    meta17: string
    meta18: string
    meta19: string
    meta20?: string
    meta21: string
    meta22?: string
    meta23?: string
    meta24?: string
    meta25?: string
    meta26: string
    meta27?: string
    meta28?: string
    meta29: string
    meta30: string
    meta31: string
    meta32: string
    meta33?: string
    meta34: string
    meta35: string
    meta36?: string
    meta37?: string
    meta38?: string
    meta39?: string
    meta40?: string
    meta41?: string
    meta42?: string
    meta43?: string
    meta44: string
    meta45?: string
    meta46: string
    meta47?: string
    meta48?: string
    meta49?: string
    meta50: string
    geocCity: string
    complement: string
    countryCode: string
    displayCity: string
    geocAddress: string
    geocPostCode?: string
    displayAddress: string
    displayPostCode: string
    position?: Position
}

export interface Position {
    x: number
    y: number
}

export interface Open {
    open_now: boolean
    open_hours: OpenHour[]
    week_day: number
    current_slice: CurrentSlice
}

export interface OpenHour {
    end: string
    start: string
}

export interface CurrentSlice {
    end: string
    start: string
}

export interface WeeklyOpening {
    timezone: string
    "1": N1
    "2": N2
    "3": N3
    "4": N4
    "5": N5
    "6": N6
    "7": N7
}

export interface N1 {
    hours: Hour[]
    isSpecial: boolean
}

export interface Hour {
    end: string
    start: string
}

export interface N2 {
    hours: Hour2[]
    isSpecial: boolean
}

export interface Hour2 {
    end: string
    start: string
}

export interface N3 {
    hours: Hour3[]
    isSpecial: boolean
}

export interface Hour3 {
    end: string
    start: string
}

export interface N4 {
    hours: Hour4[]
    isSpecial: boolean
}

export interface Hour4 {
    end: string
    start: string
}

export interface N5 {
    hours: Hour5[]
    isSpecial: boolean
}

export interface Hour5 {
    end: string
    start: string
}

export interface N6 {
    hours: Hour6[]
    isSpecial: boolean
}

export interface Hour6 {
    end: string
    start: string
}

export interface N7 {
    hours: Hour7[]
    isSpecial: boolean
}

export interface Hour7 {
    end: string
    start: string
}

export interface OpeningHours {
    usual: Usual
    timezone: string
}

export interface Usual {
    "1": N12[]
    "2": N22[]
    "3": N32[]
    "4": N42[]
    "5": N52[]
    "6": N62[]
    "7": N72[]
    default: any[]
}

export interface N12 {
    end: string
    start: string
}

export interface N22 {
    end: string
    start: string
}

export interface N32 {
    end: string
    start: string
}

export interface N42 {
    end: string
    start: string
}

export interface N52 {
    end: string
    start: string
}

export interface N62 {
    end: string
    start: string
}

export interface N72 {
    end: string
    start: string
}

export interface Geometry {
    type: string
    coordinates: number[]
}

export interface Pagination {
    page: number
    pageCount: number
}
