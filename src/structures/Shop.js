/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-private-class-members */
const { ProductsManager } = require("../managers/products/ProductsManager");
const Routes = require("../rest/Routes");
const assert = require("node:assert");

exports.Shop = class {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     * @param {import("../rest/REST").REST} rest
     */
    constructor(data, rest) {
        this.guild = data?.guild;
        this.guildId = this.guild?.id;

        let productsData = {
            products: data?.shop?.products,
            guildId: this.guildId,
            guild: this.guild,
        }
        this.products = new ProductsManager(productsData, rest);
        this.boughtCount = data?.shop.boughtCount;

        this.createdAt = data?.shop?.createdAt ? new Date(data?.shop?.createdAt) : new Date();
        this.updatedAt = data?.shop?.updatedAt ? new Date(data?.shop?.updatedAt) : new Date();

        this.#rest = rest;
        this.#data = data;
    }
    toString() {
        return `${this.id}`;
    }
    get data() {
        return this.#data;
    }
    async delete() {
        const route = Routes.guilds.shop.delete(this.guildId);
        const value = await this.#rest.request("DELETE", route);
        return value;
    };

    #updateInternals(data) {
        for (let key in data) {
            if (key == "id" || key == "_id" || key == "guildId") continue;
            if (key == "createdAt") this.createdAt = data[key] ? new Date(data[key]) : new Date();
            if (key == "updatedAt") this.updatedAt = data[key] ? new Date(data[key]) : new Date();
            if (this[key]) this[key] = data[key];
        }
    }
}