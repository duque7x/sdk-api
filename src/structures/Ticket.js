const assert = require("node:assert");
const Routes = require("../rest/Routes");
const { LogsManager } = require("../managers/logs/LogsManager");

exports.Ticket = class {
    #rest;
    constructor(data, rest) {
        this.#rest = rest;
        this.guild = data?.guild;

        this.id = data?.ticket?.id.toString();
        this.creatorId = data?.ticket?.creatorId;
        this.adminId = data?.ticket?.adminId;
        this.customerRating = data.ticket?.customerRating;
        this.closedById = data?.ticket?.closedById;
        this.type = data?.ticket?.type;
        this.status = data?.ticket?.status;
        this.channelId = data?.ticket?.channelId;

        this.createdAt = data?.ticket?.createdAt ? new Date(data?.ticket?.createdAt) : new Date();
        this.updatedAt = data?.ticket?.updatedAt ? new Date(data?.ticket?.updatedAt) : new Date();

        this.manager = data?.manager;

        this.messages = new LogsManager({
            messages: data?.ticket?.messages,
            guildId: this.guild.id,

            baseUrl: Routes.guilds.tickets.get(this.id, this.guild.id)
        }, rest);
    }
    toString() {
        return this.id || '1';
    }
    async setChannelId(id) {
        assert(id && typeof id === "string", "The admin's id must be a string.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "channelId");
        const response = await this.#rest.request("PATCH", route, { channelId: id });
        this.#update(response);

        return this;
    }
    async setAdminId(id) {
        assert(id && typeof id === "string", "The admin's id must be a string.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "adminId");
        const response = await this.#rest.request("PATCH", route, { adminId: id });
        this.#update(response);

        return this;
    }
    async setClosedById(id) {
        assert(id && typeof id === "string", "The admin's id must be a string.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "closedById");
        const response = await this.#rest.request("PATCH", route, { closedById: id });
        this.#update(response);

        return this;
    }
    async setCustomerRating(rating) {
        assert(rating && typeof rating === "number", "The customer's rating must be a number.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "customerRating");
        const response = await this.#rest.request("PATCH", route, { customerRating: rating });
        this.#update(response);

        return this;
    }
    async setType(type) {
        assert(type && typeof type === "string", "The type must be a string.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "type");
        const response = await this.#rest.request("PATCH", route, { type });
        this.#update(response);

        return this;
    }
    async setStatus(status) {
        assert(status && typeof status === "string", "The status must be a string.");
        const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "status");
        const response = await this.#rest.request("PATCH", route, { status });
        this.#update(response);

        return this;
    }
    async fetch() {
        const route = Routes.guilds.tickets.get(this.id, this.guild.id);
        const response = await this.#rest.request("DELETE", route);
        this.#update(response);

        return response;
    }
    async delete() {
        const route = Routes.guilds.tickets.delete(this.id, this.guild.id);
        const response = await this.#rest.request("DELETE", route);
        this.#update({ id: 0, messages: [], creatorId: "", adminId: "", tcustomerRating: 0, status: "off", closedById: "" });

        return response;
    }

    #update(data) {
        for (let key in data) {
            if (key == "id" || key == "guild") continue;
            if (key === "messages") {
                this.messages = new LogsManager({
                    messages: data?.messages,
                    guildId: this.guild.id,
                    baseUrl: Routes.guilds.tickets.get(this.id, this.guild.id)
                }, this.#rest);
                continue;
            }
            if (key == "createdAt") this.createdAt = data[key] ? new Date(data[key]) : new Date();
            if (key == "updatedAt") this.updatedAt = data[key] ? new Date(data[key]) : new Date();
            if (this[key] !== undefined) this[key] = data[key];
        }
    }
}