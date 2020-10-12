
export interface Vault {
    "owner": string,
    "colName": string,
    "token": string,
    "col": number,
    "debt": number,
    "liquidatedCol": number,
    "rate": number,
    "price": number,
    "status": number,
    "liquidation": number,
    "urn": string
}

export interface Vaults {
    [key:string]:Vault
}

export interface  DSAAccount {
        id: string,
        address: string,
        version: string
}
