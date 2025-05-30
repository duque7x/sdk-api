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
        this.prefix = data?.prefix;
        this.id = data?.id;
        this.name = data?.name;
        this.status = data?.status;
        this.pricesOn = data?.pricesOn;
        this.pricesAvailable = data?.pricesAvailable;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this._id = data?._id;
        this.seasonId = data?.seasonId;
        this.blacklist = data?.blacklist;
        this.betsChannels = data?.betsChannels == undefined ? {} : {
            "1v1": data?.betsChannels["1v1"],
            "2v2": data?.betsChannels["2v2"],
            "3v3": data?.betsChannels["3v3"],
            "4v4": data?.betsChannels["4v4"],
        };
        this.channels = data?.channels ? {
            "dailyRank": data?.channels["dailyRank"] ?? ""
        } : {};
        this.#data = data;
        this.#rest = rest;

        this.users = new UsersManager(rest, this.id);
        this.betUsers = new BetUsersManager(rest, this.id);
        this.bets = new BetsManager(rest, this.id);
        this.matches = new MatchesManager(rest, this.id);
        this.mediators = new MediatorsManager(rest, this.id);
    }
    get data() {
        return this.#data;
    }

    async add(key, value) {
        assert(key && typeof key === "string", "Key must be present");
        assert(value, "Value must be present");

        const route = Routes.guilds.resource(key, this.id);

        if (key == "betsChannels") {
            assert(typeof value == "object", "Value must an object");
            assert(value.type, "Value type must be presentt");
            assert(value.id, "Value id must be present");

            const response = await this.#rest.request('PATCH', route, value);
            this[key] = response;
            this.#rest.emit("guildUpdate", response);
            return response;
        }
        if (key === "status") {
            assert(typeof value == "object", "Value must an object");
            assert(value.type, "Value type must be presentt");
            assert(value.value, "Value value must be present");

            const payload = { status: value.value }
            const response = await this.#rest.request('PATCH', Routes.fields(route, value.type), payload);
            this[key] = response;
            this.#rest.emit("guildUpdate", response);
            return response;
        }
        const response = await this.#rest.request('PATCH', route, { [key]: value });

        this[key] = response;
        this.#rest.emit("guildUpdate", response);
        return value;
    }

    async remove(key, value) {
        const route = Routes.guilds.resource(key, this.id);
        const response = await this.#rest.request('DELETE', route, { [key]: value });
        this[key] = response;
        return value;
    }

    async set(key, value) {
        if (key == "dailyRankStatus" || key == "matchesStatus" || key == "betsStatus") {
            const statusMaps = {
                dailyRankStatus: "dailyRank",
                matchesStatus: "matches",
                betsStatus: "bets"
            }
            const route = Routes.fields(Routes.guilds.resource("status", this.id), statusMaps[key]);
            const response = await this.#rest.request('PATCH', route, { status: value });
            this.status[statusMaps[key]] = response;

            this.#rest.emit("guildUpdate", this);
            return this.status;
        }
        const route = Routes.guilds.resource(key, this.id);
        const response = await this.#rest.request('PATCH', route, { set: value });
        this[key] = response;
        return this.status;
    }

    #autoClean() {
        this.pricesOn = [...new Set(this.pricesOn ?? [])].sort((a, b) => a - b);
        this.pricesAvailable = [...new Set(this.pricesAvailable ?? [])].sort((a, b) => a - b);
    }

    async updateInternals() {
        this.#autoClean();
        const baseRoute = Routes.guilds.get(this.id);

        const requisition = async () => {
            try {
                const [users, betUsers, bets, matches, mediators] = await Promise.all([
                    this.#rest.request("GET", Routes.fields(baseRoute, "users")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "betUsers")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "bets")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "matches")),
                    this.#rest.request("GET", Routes.fields(baseRoute, "mediators"))
                ]);
                this.setstuff(users, betUsers, bets, matches, mediators);
            } catch (error) {
                console.error(`Erro ao atualizar dados da guilda ${this.id}:`, error);
            }
        };

        const FIVE_MINUTES = 5 * 60 * 1000;
        await requisition();
        setInterval(() => requisition(), FIVE_MINUTES);
    }

    setstuff(users, betUsers, bets, matches, mediators) {
        for (let user of users ?? []) {
            if (!user || !user.id) continue;
            const instance = new User(user, this.#rest, this.id);
            this.users.set(user.id, instance);
            this.#rest.users.set(user.id, instance);
        }

        for (let user of betUsers ?? []) {
            if (!user || !user.id) continue;
            const instance = new BetUser(user, this.#rest, this.id);
            let oe = this.betUsers.set(user.id, instance);
            this.#rest.betUsers.set(user.id, instance);
        }

        for (let bet of bets ?? []) {
            if (!bet || !bet._id) continue;
            const instance = new Bet(bet, this.#rest, this.id);
            this.bets.set(bet._id, instance);
            this.#rest.bets.set(bet._id, instance);
        }

        for (let match of matches ?? []) {
            if (!match || !match._id) continue;
            const instance = new Match(match, this.#rest, this.id);
            this.matches.set(match._id, instance);
            this.#rest.matches.set(match._id, instance);
        }

        for (let mediator of mediators ?? []) {
            if (!mediator || !mediator.id) continue;
            const instance = new Mediator(mediator, this.#rest, this.id);
            this.mediators.set(mediator.id, instance);
        }
    }
}

module.exports = { Guild };