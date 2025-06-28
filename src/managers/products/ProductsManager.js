const { Collection } = require("../../structures/Collection");
const { Product } = require("../../structures/Product");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.ProductsManager = class {
    #products;
    #rest;
    /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
    constructor(data, rest) {
        this.createdAt = data?.products?.createdAt ? new Date(data?.products?.createdAt) : new Date();
        this.updatedAt = data?.products?.updatedAt ? new Date(data?.products?.updatedAt) : new Date();

        this.guildId = data?.guildId;
        this.#rest = rest;
        this.#products = new Collection();

        this.#updateProducts(data?.products);
    }
    get cache() {
        return this.#products;
    }
    set(id, product) {
        id = id.toString();
        assert(id && typeof id === "string", `${id} must be a string`);
        return this.#set(product);
    }
    async fetch(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Mongoose Object Id`);

        const route = Routes.guilds.shop.products.get(id, this.guildId);
        const response = await this.#rest.request("GET", route)
        return this.#set(response);
    };
    async fetchAll() {
        const route = Routes.guilds.shop.products.getAll(this.guildId);
        const response = await this.#rest.request("GET", route);

        this.#products.clear();
        for (let productData of response) this.#set(productData);
        return this.#products;
    };
    async create(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.name && typeof payload.name === "string", "Payload must include a name");
        assert(payload.description && typeof payload.description === "string", "Payload must include a description");
        assert(payload.price && typeof payload.price === "number", "Payload price must be a number and be present");

        const route = Routes.guilds.shop.products.create(this.guildId);
        const response = await this.#rest.request('POST', route, payload);
        const product = this.#set(response);

        this.#rest.emit("productCreate", product);
        return product;
    }
    async delete(id) {
        assert(id && typeof id === "string", "Id must be a Mongoose Object Id");

        const route = Routes.guilds.shop.products.delete(id, this.guildId);
        const product = this.#products.get(id);
        this.#rest.emit("productDelete", product);
        await this.#rest.request("DELETE", route, { guildId: this.guildId });

        this.#remove(id);
        return;
    };
    async deleteAll() {
        const route = Routes.guilds.shop.products.deleteAll(this.guildId);
        this.#rest.emit("productsDelete", this.#products);

        const value = await this.#rest.request("DELETE", route, { guildId: this.guildId });
        this.#products.clear();
        return value;
    };
    #remove(id) {
        this.#products.delete(id);
    }
    #set(product) {
        product = product instanceof Product ? product : new Product(product, this.#rest, this.guildId, this);
        this.#products.set(product.id, product);
        return product;
    }
    #updateProducts(data) {
        for (let product of data ?? []) this.#set(product);
    }
}