const Routes = require("../rest/Routes");
const assert = require("node:assert");
const { BetsManager } = require("../managers/bets/BetsManager");
const { UsersManager } = require("../managers/users/UsersManager");
const { MatchesManager } = require("../managers/matches/MatchesManager");
const { BetUsersManager } = require("../managers/betusers/BetUsersManager");
const { MediatorsManager } = require("../managers/mediators/MediatorsManager");

class Guild {
    #rest;
    #data;

    constructor(data, rest) {
        this.id = data?.id;
        this.name = data?.name;
        this.prefix = data?.prefix;
        this.status = data?.status;
        this.pricesOn = data?.pricesOn ?? [];
        this.pricesAvailable = data?.pricesAvailable ?? [];
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this._id = data?._id;
        this.blacklist = [];

        this.roles = data?.roles ?? {};
        this.messages = data?.messages ?? {};
        this.emojis = data?.emojis ?? {};

        this.channels = data?.channels ?? {};;
        this.categories = data?.categories ?? {};;

        this.users = new UsersManager({ users: data?.users, guildId: this.id }, rest);
        this.betUsers = new BetUsersManager({ betUsers: data?.betUsers, guildId: this.id }, rest);
        this.bets = new BetsManager({ bets: data?.bets, guildId: this.id }, rest);
        this.matches = new MatchesManager({ matches: data?.matches, guildId: this.id }, rest);
        this.mediators = new MediatorsManager({ mediators: data?.mediators, guildId: this.id }, rest);

        this.#rest = rest;
        this.#data = data;

        for (let pl of data?.blacklist ?? []) {
            this.blacklist.push({ id: pl.id, addedBy: pl.addedBy, when: new Date(pl.when) });
        }

        this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
        this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    }
    toString() {
        return `${this._id}`;
    }
    get data() {
        return this.#data;
    }
    async setBlacklist(value, userId, adminId) {
        assert(value !== undefined && typeof value === "boolean", "Value must be a boolean");

        const user = this.betUsers.cache.get(userId);

        const route = Routes.guilds.resource("blacklist", this.id);
        const payload = {
            id: userId,
            name: user.name ?? "dw",
            adminId,
            value
        };
        const [updatedData] = await Promise.all([this.#rest.request("PATCH", route, payload), user.update({ blacklist: true })]);
        this.updateInternals(updatedData);
        return this;
    }

    async addMessage(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("messages", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeMessage(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("messages", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addEmoji(type, id, animated) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("emojis", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type, animated });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeEmoji(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("emojis", this.id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addRole(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("roles", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeRole(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("roles", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addCategory(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("categories", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeCategory(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("categories", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async addChannel(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("channels", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }
    async removeChannel(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.fields(Routes.guilds.resource("channels", this.id), type, id);
        const updatedData = await this.#rest.request("DELETE", route, { id, type });

        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    }

    async setStatus(key, status) {
        assert(typeof key == "string", "Key must be a string");
        assert(typeof status == "string", "Status must be a string");

        const route = Routes.fields(Routes.guilds.resource("status", this.id), key);
        const updatedData = await this.#rest.request("PATCH", route, { status });

        this.updateInternals(updatedData);
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
            this.updateInternals(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        if (key === "status") {
            assert(typeof value === "object", "Value must be an object");
            assert(value.type && value.value, "Type and value must be present");

            const payload = { status: value.value };
            const updatedData = await this.#rest.request("PATCH", Routes.fields(route, value.type), payload);
            this.updateInternals(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        const updatedData = await this.#rest.request("PATCH", route, { [key]: value });
        this.updateInternals(updatedData);
        this.#rest.emit("guildUpdate", updatedData);
        return updatedData;
    }

    async remove(key, value) {
        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("DELETE", route, { [key]: value });
        this.updateInternals(updatedData);
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
            this.updateInternals(updatedData);
            this.#rest.emit("guildUpdate", this);
            return this.status;
        }

        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("PATCH", route, { set: value });
        this.updateInternals(updatedData);
        return this.status;
    }

    #autoClean() {
        this.pricesOn = [...new Set(this.pricesOn)].sort((a, b) => a - b);
        this.pricesAvailable = [...new Set(this.pricesAvailable)].sort((a, b) => a - b);
    }

    async updateInternalsFetchly() {
        const ONE_MINUTE = 1 * 60 * 1000;
        this.#autoClean();
        const baseRoute = Routes.guilds.get(this.id);

        const update = async () => {
            try {
                const [users, betUsers, bets, matches, mediators] = await Promise.all([
                    this.#rest.request("GET", Routes.fields(baseRoute, "users")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "betUsers")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "bets")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "matches")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "mediators")),
                ]);
                this.initialize(users, betUsers, bets, matches, mediators);
            } catch (err) {
                console.error(`Erro ao atualizar dados da guilda ${this.id}:`, err);
            }
        };
        setInterval(update, ONE_MINUTE);
    }

    initialize(users, betUsers, bets, matches, mediators) {
        for (const user of users ?? []) {
            if (!user?.id) continue;

            this.users.set(user.id, user);
            this.#rest.users.set(user.id, user);
        }

        for (const user of betUsers ?? []) {
            if (!user?.id) continue;

            this.betUsers.set(user.id, user);
            this.#rest.betUsers.set(user.id, user);
        }

        for (const bet of bets ?? []) {
            if (!bet?._id) continue;

            this.bets.set(bet._id, bet);
            this.#rest.bets.set(bet._id, bet);
        }

        for (const match of matches ?? []) {
            if (!match?._id) continue;

            this.matches.set(match._id, match);
            this.#rest.matches.set(match._id, match);
        }

        for (const mediator of mediators ?? []) {
            if (!mediator?.id) continue;
            this.mediators.set(mediator.id, mediator);

        }
    }

    updateInternals(data) {
        for (const key in data) {
            if (["id", "_id", "guildId"].includes(key)) continue;

            const baseKeys = ["prefix", "name", "status", "pricesOn", "pricesAvailable", "updatedAt", "seasonId", "blacklist", "betsChannels", "channels", "roles", "categories"];
            if (baseKeys.includes(key)) {
                this[key] = data[key];
            }
            if (key === "users") {
                const users = data.users;
                this.initialize(users);
            }

            if (key === "betUsers") {
                const betUsers = data.betUsers;
                this.initialize([], betUsers);
            }

            if (key === "bets") {
                const bets = data.bets;
                this.initialize([], [], bets);

            }

            if (key === "matches") {
                const matches = data.matches;
                this.initialize([], [], [], matches);
            }

            if (key === "mediators") {
                const mediators = data.mediators;
                this.initialize([], [], [], [], mediators);
            }
        }
    }
}

module.exports = { Guild };
