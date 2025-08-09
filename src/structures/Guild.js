const Routes = require("../rest/Routes");
const assert = require("node:assert");
const { BetsManager } = require("../managers/bets/BetsManager");
const { UsersManager } = require("../managers/users/UsersManager");
const { MatchesManager } = require("../managers/matches/MatchesManager");
const { BetUsersManager } = require("../managers/betusers/BetUsersManager");
const { MediatorsManager } = require("../managers/mediators/MediatorsManager");
const { Shop } = require("./Shop");
const { GroupedChannelManager } = require("../managers/groupedchannel/GroupedChannelManager");
const { TicketsManager } = require("../managers/tickets/TicketsManager");
const { PermissionsManager } = require("../managers/permissions/PermissionsManager");

class Guild {
    #rest;
    #data;

    constructor(data, rest) {
        this.#rest = rest;
        this.#data = data;

        this.id = data?.id;
        this.dailyCategories = data?.dailyCategories;

        this.name = data?.name;
        this.prefix = data?.prefix;
        this.status = data?.status;
        this.pricesOn = data?.pricesOn || [];
        this.pricesAvailable = data?.pricesAvailable || [];
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.blacklist = [];

        this.roles = data?.roles || {};
        this.messages = data?.messages || {};
        this.emojis = data?.emojis || {};

        this.tickets = new TicketsManager({ tickets: data?.tickets, guild: this }, rest);
        this.ticketsConfiguration = data?.ticketsConfiguration;

        this.channels = new GroupedChannelManager({
            data: data?.channels,
            baseUrl: Routes.guilds.resource("channels", data.id),
            guild: this,
        }, rest);
        this.categories = new GroupedChannelManager({
            data: data?.categories,
            baseUrl: Routes.guilds.resource("categories", data.id),
            guild: this,
        }, rest);
        this.permissions = new PermissionsManager({
            data: data?.permissions, 
            baseUrl: Routes.guilds.resource("permissions", data.id),
            guild: this
        }, rest);

        
        this.users = new UsersManager({ users: data?.users, guildId: this.id }, rest);
        this.betUsers = new BetUsersManager({ betUsers: data?.betUsers, guildId: this.id }, rest);
        this.bets = new BetsManager({ bets: data?.bets, guildId: this.id }, rest);
        this.matches = new MatchesManager({ matches: data?.matches, guildId: this.id }, rest);
        this.mediators = new MediatorsManager({ mediators: data?.mediators, guildId: this.id }, rest);

        for (let pl of data?.blacklist || []) {
            this.blacklist.push({ id: pl.id, addedBy: pl.addedBy, when: pl.when ? new Date(pl.when) : new Date() });
        }

        this.shop = new Shop({ guild: this, shop: data.shop }, rest);

        this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
        this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    }
    toString() {
        return `${this._id}`;
    }
    get data() {
        return this.#data;
    }
    async fetch() {
        const route = Routes.guilds.get(this.id);
        const response = await this.#rest.request("GET", route);
        this.updateData(response);
        return this;
    }
    async setBlacklist(value, user, adminId) {
        assert(value !== undefined && typeof value === "boolean", "Value must be a boolean");
        const is_in_blacklist = this.blacklist.find(u => u.id == user.id);
        if (is_in_blacklist && value == true) return this;

        const route = Routes.guilds.resource("blacklist", this.id);
        const payload = { id: user.id, name: user.name, adminId, value };

        const [updatedData] = await Promise.all([
            this.#rest.request("PATCH", route, payload),
            user.setBlacklist(value)
        ]);

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }

    async addMessage(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("messages", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeMessage(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("messages", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addEmoji(type, id, animated) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("emojis", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type, animated });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeEmoji(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("emojis", this.id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addRole(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("roles", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeRole(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("roles", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addCategory(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("categories", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeCategory(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("categories", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addChannel(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("channels", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeChannel(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("channels", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }

    async setStatus(key, status) {
        assert(typeof key == "string", "Key must be a string");
        assert(typeof status == "string", "Status must be a string");
        status = status.toLowerCase();

        const route = Routes.fields(Routes.guilds.resource("status", this.id), key);
        const updatedData = await this.#rest.request("PATCH", route, { status });

        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }

    async add(key, value) {
        assert(typeof key === "string", "Key must be a string");
        assert(value !== undefined, "Value must be provided");

        const route = Routes.guilds.resource(key, this.id);

        if (key === "betsChannels") {
            assert(typeof value === "object", "Value must be an object");
            assert(value.type && value.id, "Both type and id must be present");

            const updatedData = await this.#rest.request("PATCH", route, value);
            this.updateData(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        if (key === "status") {
            assert(typeof value === "object", "Value must be an object");
            assert(value.type && value.value, "Type and value must be present");

            const payload = { status: value.value };
            const updatedData = await this.#rest.request("PATCH", Routes.fields(route, value.type), payload);
            this.updateData(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        const updatedData = await this.#rest.request("PATCH", route, { [key]: value });
        this.updateData(updatedData);
        this.#rest.emit("guildUpdate", updatedData);
        return updatedData;
    }

    async remove(key, value) {
        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("DELETE", route, { [key]: value });
        this.updateData(updatedData);
        return value;
    }

    async set(key, value) {
        if (["dailyRankStatus", "matchesStatus", "betsStatus"].includes(key)) {
            const statusMap = {
                dailyRankStatus: "dailyRank",
                matchesStatus: "matches",
                betsStatus: "bets"
            };

            const route = Routes.fields(Routes.guilds.resource("status", this.id), statusMap[key]);
            const updatedData = await this.#rest.request("PATCH", route, { status: value });
            this.updateData(updatedData);
            this.#rest.emit("guildUpdate", this);
            return this.status;
        }

        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("PATCH", route, { set: value });
        this.updateData(updatedData);
        return this.status;
    }
    updateData(data) {
        for (const key in data) {
            if (["id", "_id", "guildId"].includes(key)) continue;
            if (key == "createdAt") this.createdAt = data[key] ? new Date(data[key]) : new Date();
            if (key == "updatedAt") this.updatedAt = data[key] ? new Date(data[key]) : new Date();

            if (key === "users") {
                const users = data.users;
                for (const user of users || []) {
                    if (!user?.id) continue;

                    this.users.set(user.id, user);
                    this.#rest.users.set(user.id, user);
                }
            }

            if (key === "betUsers") {
                const betUsers = data.betUsers;
                for (const user of betUsers || []) {
                    if (!user?.id) continue;

                    this.betUsers.set(user.id, user);
                    this.#rest.betUsers.set(user.id, user);
                }
            }

            if (key === "bets") {
                const bets = data.bets;
                for (const bet of bets || []) {
                    if (!bet?._id) continue;
                    this.bets.set(bet._id, bet);
                    this.#rest.bets.set(bet._id, bet);
                }
            }
            if (key === "matches") {
                const matches = data.matches;
                for (const match of matches || []) {
                    if (!match?._id) continue;

                    this.matches.set(match._id, match);
                    this.#rest.matches.set(match._id, match);
                }
            }
            if (key === "mediators") {
                const mediators = data.mediators;
                for (const mediator of mediators || []) {
                    if (!mediator?.id) continue;
                    this.mediators.set(mediator.id, mediator);
                }
            }
            if (key === "channels") {
                const channels = data.channels;

                for (const channel of channels || []) {
                    if (!channel?.type) continue;
                    this.channels.set(channel.type, channel);
                }
            }
            if (key === "categories") {
                const categories = data.categories;
                for (const category of categories || []) {
                    if (!category?.type) continue;
                    this.categories.set(category.type, category);
                }
            }
            if (key === "tickets") {
                const tickets = data.tickets;

                for (const ticket of tickets || []) {
                    if (!ticket?.type) continue;
                    this.tickets.set(ticket.id, ticket);
                }
            }
        }
    }
}
module.exports = { Guild };