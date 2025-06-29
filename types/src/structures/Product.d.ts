import { Players, ProductData, ShopData } from "../../../index";
import { ProductsManager } from "../../../src/managers/products/ProductsManager";
import { REST } from "../rest/REST";

export declare class Product {
    /**
     * This is the Manager 
     */
    manager: ProductsManager;

    /**
     * This is the guild id
     */
    guildId: string;

    /**
     * This is the name
     */
    name: string;

    /**
     * This is the product's emoji
     */
    emoji: string;
    /**
     * The description of the product
     */
    description: string;

    /**
     * The id of the preoduct
     */
    id: string;

    /**
     * Price of the product
     */
    price: number;

    /**
     * This is the players that have bought this product
     */
    buyers: Players


    /**
       * The date of the creation of the user
       */
    createdAt: Date;

    /**
     * The last date where the user was updated
     */
    updatedAt: Date;

    /**
     * 
     * @param {*} data 
     * @param {import("../rest/REST").REST} rest
     */
    constructor(data: ShopData, rest: REST);

    /**
     * Returns a string of the product id
     */
    toString(): string;

    /**
     * Returns the product data
     */
    get data(): ProductData;

    /**
     * Fetches this product and returns the most updated data
     */
    fetch(): Promise<Product>;

    /**
     * Update this product such as price, name or description
     * @param payload The new update data
     */
    update(payload: ProductData): Promise<Product>;
    update(payload: Product): Promise<Product>;

    /**
     * Set a new price of the product
     * @param price The new price
     */
    setPrice(price: number): Promise<Product>;

    /**
     * Add a buyer to the product
     * @param id The buyer's id
     * @param name The buyer's name
     * @param type The buyer's type
     */
    addBuyer(id: string, name: string, type: BuyersType): Promise<Product>;

    /**
     * Remove a product's buyer
     * @param id The buyer's id
     * @param name The buyer's name
     * @param type The buyer's type
     */
    removeBuyer(id: string, name: string, type: BuyersType): Promise<Product>;

    /**
     * Deletes this product
     * @param type The type of the product
     */
    delete(type: BuyersType): Promise<boolean>;
}

type BuyersType = 'bet' | 'match';