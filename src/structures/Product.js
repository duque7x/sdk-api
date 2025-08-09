const { assert } = require("console");
const Routes = require("../rest/Routes");

exports.Product = class {
    #rest;
    #data;
    /**
     * 
     * @param {*} data 
     * @param {import("../rest/REST").REST} rest
     */
    constructor(data, rest, guildId, manager) {
        this.manager = manager;
        this.guildId = guildId;

        this.name = data?.name;
        this.description = data?.description;
        this.emoji = data?.emoji;
        this.id = data?.id;

        this.price = data?.price;
        this.buyers = data?.buyers;

        this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
        this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

        this.#rest = rest;
        this.#data = data;
    }
    toString() {
        return `${this.id}`;
    }
    get data() {
        return this.#data;
    }
    async fetch() {
        const route = Routes.guilds.shop.products.get(this.id, this.guildId);
        const response = await this.#rest.request("GET", route);
        return response;
    }
    async update(payload) {
        assert(payload && typeof payload == "object", "Payload must be an object");

        const route = Routes.guilds.shop.products.update(this.id, this.guildId);
        const response = await this.#rest.request("PATCH", route, payload);
        this.#updateInternals(response);

        return this;
    };
    async setPrice(price) {
        assert(price && typeof price == "number", "Price must be a number");

        const route = Routes.guilds.shop.products.resource(this.id, this.guildId, "price");
        const response = await this.#rest.request("PATCH", route, { set: price });
        this.#updateInternals(response);

        return this;
    }
    async addBuyer(id, name, type) {
        assert(id && typeof id == "string", "Id must be a number");
        assert(name && typeof name == "string", "Name must be a number");
        assert(type && typeof type == "string", "name must be a number");

        const payload = { id, name, type };
        const route = Routes.guilds.shop.products.resource(this.id, this.guildId, "buyers");
        const response = await this.#rest.request("POST", route, payload);

        let user;
        if (type == "bet") user = this.manager.guild.betUsers.cache.get(id);
        else if (type == "match") user = this.manager.guild.users.cache.get(id);
        user.items = [...new Set([...user.items, this.id])];

        this.#updateInternals(response);
        return this;
    }
    async removeBuyer(id, name, type) {
        assert(id && typeof id == "string", "Id must be a number");
        assert(name && typeof name == "string", "Name must be a number");
        assert(type && typeof type == "string", "name must be a number");

        const payload = { id, name, type };
        const route = Routes.guilds.shop.products.resource(this.id, this.guildId, "buyers", id);
        const response = await this.#rest.request("DELETE", route, payload);

        let user;
        if (type == "bet") user = this.manager.guild.betUsers.cache.get(id);
        else if (type == "match") user = this.manager.guild.users.cache.get(id);
        user.items = [...new Set(user.items.filter(item => item != this.id))];

        this.#updateInternals(response);
        return this;
    }
    async delete(type) {
        const route = Routes.guilds.shop.products.delete(this.id, this.guildId);
        const value = await this.#rest.request("DELETE", route, { type });
        return value;
    };

    #updateInternals(data) {
        for (let key in data) {
            if (key == "id" || key == "_id" || key == "guildId") continue;
            if (key == "createdAt") this.createdAt = data[key] ? new Date(data[key]) : new Date();
            if (key == "updatedAt") this.updatedAt = data[key] ? new Date(data[key]) : new Date();
            if (this[key]) this[key] = data[key];
        }
        this.manager.set(this.id, this);
    }
}