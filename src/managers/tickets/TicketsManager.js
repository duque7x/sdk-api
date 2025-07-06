const assert = require("node:assert");
const Routes = require("../../rest/Routes");
const { Ticket } = require("../../structures/Ticket");
const { BaseManager } = require("../BaseManager");
const { isIterable } = require("../../utils/isIterable");

exports.TicketsManager = class extends BaseManager {
    #rest;
    constructor(data, rest) {
        super(data?.tickets);

        this.#rest = rest;

        this.guild = data?.guild;
        this.#updateTickets(data?.tickets);
    }
    async addCategory(type, description, emoji, alias) {
        assert(type && typeof type == "string", "Type must be a string");
        assert(description && typeof description == "string", "Description must be a string");
        assert(alias && typeof alias == "string", "Alias must be a string");

        const payload = { type, description, emoji, alias };
        const route = Routes.fields(Routes.guilds.resource("ticketsConfiguration", this.guild.id), "categories");
        const response = await this.#rest.request("POST", route, payload);

        this.guild.ticketsConfiguration = response;
        const category = response.categories.find(c => c.type == type);
        return category;
    }
    async updateCategory(type, payload) {
        assert(type && typeof type == "string", "Type must be a string");
        assert(payload && typeof payload == "object", "Payload must be an object");

        const route = Routes.fields(Routes.guilds.resource("ticketsConfiguration", this.guild.id), "categories", type);
        const response = await this.#rest.request("PATCH", route, payload);

        return response;
    }
    async removeCategory(type) {
        assert(type && typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("ticketsConfiguration", this.guild.id), "categories", type);
        const response = await this.#rest.request("DELETE", route);

        this.guild.ticketsConfiguration.categories = response;
        return response;
    }
    set(id, ticket) {
        if (!id) return this.cache;
        const ticketData = {
            manager: this,
            guild: this.guild,
            ticket: ticket
        };

        ticket = ticket instanceof Ticket
            ? ticket
            : new Ticket(ticketData, this.#rest);

        this.cache.set(id.toString(), ticket);
        return ticket;
    }
    async create(creatorId, type, channelId) {
        assert(creatorId && typeof creatorId == "string", "Id must be a string");
        assert(type && typeof type == "string", "Type must be a string");

        const payload = { creatorId, type, channelId };
        const route = Routes.guilds.tickets.create(this.guild.id);
        const response = await this.#rest.request("POST", route, payload);

        const ticket = this.set(response.id, response);
        return ticket;
    }
    async fetch(id) {
        assert(id && typeof id == "string", "Id must be a string");

        const route = Routes.guilds.tickets.get(id, this.guild.id);
        const response = await this.#rest.request("GET", route);

        const ticket = this.set(response.id, response);
        return ticket;
    }
    async fetchAll() {
        const route = Routes.guilds.tickets.getAll(this.guild.id);
        const response = await this.#rest.request("GET", route);
        this.#updateTickets(response);

        return this.cache;
    }

    async delete(id) {
        assert(id && typeof id == "string", "Id must be a string");

        const route = Routes.guilds.tickets.delete(id, this.guild.id);
        const value = await this.#rest.request("DELETE", route);
        return value;
    }

    async deleteAll() {
        const route = Routes.guilds.tickets.deleteAll(this.guild.id);
        const value = await this.#rest.request("DELETE", route);
        this.cache.clear();
        return value;
    }

    #updateTickets(data) {
        if (isIterable(data)) {
            for (let ticket of data || []) this.set(ticket.id, ticket);
            return this.cache;
        }
        this.set(data.id, data);
    }
}