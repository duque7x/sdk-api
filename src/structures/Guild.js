const Routes = require("../rest/Routes");
const { Bet } = require("./Bet");
const { Collection } = require("./Collection");
const { Match } = require("./Match");
const { User } = require("./User");
const assert = require("node:assert");
const { BetsManager } = require("../managers/bets/BetsManager");
const { UsersManager } = require("../managers/users/UsersManager");
const { MatchesManager } = require("../managers/matches/MatchesManager");
const { BetUsersManager } = require("../managers/betusers/BetUsersManager");
const { BetUser } = require("./BetUser");
const { MediatorsManager } = require("../managers/mediators/MediatorsManager");
const { Mediator } = require("./Mediator");

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
        this.blacklist = data?.blacklist ?? [];

        this.roles = data?.roles ?? {};
        this.channels = data?.channels ?? {};;
        this.categories = data?.categories ?? {};;
        
        this.users = new UsersManager(rest, this.id);
        this.betUsers = new BetUsersManager(rest, this.id);
        this.bets = new BetsManager(rest, this.id);
        this.matches = new MatchesManager(rest, this.id);
        this.mediators = new MediatorsManager(rest, this.id);

        this.#rest = rest;
        this.#data = data;
    }

    get data() {
        return this.#data;
    }
    async addRole(type, id) {
        assert(typeof id == "string", "Id must be a string");
        assert(typeof type == "string", "Type must be a string");

        const route = Routes.guilds.resource("roles", this.id);
        const updatedData = await this.#rest.request("POST", route, { id, type });
        
        this.#updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    } 
    async addCategory(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("categories", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });
        
        this.#updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    } 
    async addChannel(type, id) {
        assert(typeof type == "string", "Type must be a string");
        assert(typeof id == "string", "Id must be a string");

        const route = Routes.guilds.resource("channels", this.id);
        const updatedData = await this.#rest.request("POST", route, { type, id });
        
        this.#updateInternals(updatedData);
        this.#rest.emit("guildUpdate", this);
        return this;
    } 
    async setStatus(key, status) {
        assert(typeof key == "string", "Key must be a string");
        assert(typeof status == "string", "Status must be a string");

        const route = Routes.fields(Routes.guilds.resource("status", this.id), key);
        const updatedData = await this.#rest.request("PATCH", route, { status });
        
        this.#updateInternals(updatedData);
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
            this.#updateInternals(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        if (key === "status") {
            assert(typeof value === "object", "Value must be an object");
            assert(value.type && value.value, "Type and value must be present");

            const payload = { status: value.value };
            const updatedData = await this.#rest.request("PATCH", Routes.fields(route, value.type), payload);
            this.#updateInternals(updatedData);
            this.#rest.emit("guildUpdate", updatedData);
            return updatedData;
        }

        const updatedData = await this.#rest.request("PATCH", route, { [key]: value });
        this.#updateInternals(updatedData);
        this.#rest.emit("guildUpdate", updatedData);
        return updatedData;
    }

    async remove(key, value) {
        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("DELETE", route, { [key]: value });
        this.#updateInternals(updatedData);
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
            this.#updateInternals(updatedData);
            this.#rest.emit("guildUpdate", this);
            return this.status;
        }

        const route = Routes.guilds.resource(key, this.id);
        const updatedData = await this.#rest.request("PATCH", route, { set: value });
        this.#updateInternals(updatedData);
        return this.status;
    }

    #autoClean() {
        this.pricesOn = [...new Set(this.pricesOn)].sort((a, b) => a - b);
        this.pricesAvailable = [...new Set(this.pricesAvailable)].sort((a, b) => a - b);
    }

    async updateInternals() {
        const FIVE_MINUTES = 5 * 60 * 1000;
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
                this.setstuff(users, betUsers, bets, matches, mediators);
            } catch (err) {
                console.error(`Erro ao atualizar dados da guilda ${this.id}:`, err);
            }
        };
        await update();
        setInterval(update, FIVE_MINUTES);
    }

    setstuff(users, betUsers, bets, matches, mediators) {
        for (const u of users ?? []) {
            if (!u?.id) continue;
            const user = new User(u, this.#rest, this.id);
            this.users.set(user.id, user);
            this.#rest.users.set(user.id, user);
        }

        for (const bu of betUsers ?? []) {
            if (!bu?.id) continue;
            const betUser = new BetUser(bu, this.#rest, this.id);
            this.betUsers.set(betUser.id, betUser);
            this.#rest.betUsers.set(betUser.id, betUser);
        }

        for (const b of bets ?? []) {
            if (!b?._id) continue;
            const bet = new Bet(b, this.#rest, this.id);
            this.bets.set(bet._id, bet);
            this.#rest.bets.set(bet._id, bet);
        }

        for (const m of matches ?? []) {
            if (!m?._id) continue;
            const match = new Match(m, this.#rest, this.id);
            this.matches.set(match._id, match);
            this.#rest.matches.set(match._id, match);
        }

        for (const md of mediators ?? []) {
            if (!md?.id) continue;
            const mediator = new Mediator(md, this.#rest, this.id);
            this.mediators.set(mediator.id, mediator);
        }
    }

    #updateInternals(data) {
        for (const key in data) {
            if (["id", "_id", "guildId"].includes(key)) continue;

            const baseKeys = ["prefix", "name", "status", "pricesOn", "pricesAvailable", "updatedAt", "seasonId", "blacklist", "betsChannels", "channels", "roles", "categories"];
            if (baseKeys.includes(key)) {
                this[key] = data[key];
            }

            if (key === "users") {
                this.users.cache.clear();
                for (const u of data[key]) {
                    if (!u?.id) continue;
                    const user = new User(u, this.#rest, this.id);
                    this.users.set(user.id, user);
                }
            }

            if (key === "betUsers") {
                this.betUsers.cache.clear();
                for (const u of data[key]) {
                    if (!u?.id) continue;
                    const betUser = new BetUser(u, this.#rest, this.id);
                    this.betUsers.set(betUser.id, betUser);
                }
            }

            if (key === "bets") {
                this.bets.cache.clear();
                for (const b of data[key]) {
                    if (!b?._id) continue;
                    const bet = new Bet(b, this.#rest, this.id);
                    this.bets.set(bet._id, bet);
                }
            }

            if (key === "matches") {
                this.matches.cache.clear();
                for (const m of data[key]) {
                    if (!m?._id) continue;
                    const match = new Match(m, this.#rest, this.id);
                    this.matches.set(match._id, match);
                }
            }

            if (key === "mediators") {
                this.mediators.cache.clear();
                for (const md of data[key]) {
                    if (!md?.id) continue;
                    const mediator = new Mediator(md, this.#rest, this.id);
                    this.mediators.set(mediator.id, mediator);
                }
            }
        }
    }
}

module.exports = { Guild };
