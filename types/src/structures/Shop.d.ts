import { ShopData } from "../../../index";
import { ProductsManager } from "../managers/ProductsManager";
import { REST } from "../rest/REST";
import { Guild } from "./Guild";

export declare class Shop {
    /**
     * The entitled guild
     */
    guild: Guild;

    /**
     * The products that the shop has
     */
    products: ProductsManager;

    /**
     * The amount times products have been bought
     */
    boughtCount: number;

    /**
    * The date of the creation of the match
    */
    createdAt: Date;

    /**
     * The last date where the match was updated
     */
    updatedAt: Date;

    /**
     * 
     * @param {*} data 
     * @param {import("../rest/REST").REST} rest
     */
    constructor(data: ShopData, rest: REST);

    /**
     * Returns a string representation of this shop
     */
    toString(): string;

    /**
     * Returns the data of the shop in the guild
     */
    get data(): ShopData;

    /**
     * Completely delete the shop
     */
    delete(): Promise<boolean>;
}