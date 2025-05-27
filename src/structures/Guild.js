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

class Guild {
    #rest;
    #data;
    constructor(data, rest) {
        this.prefix = data?.prefix;
        this.id = data?.id;
        this.name = data?.name;
        this.state = data?.state;
        this.pricesOn = data?.pricesOn;
        this.pricesAvailable = data?.pricesAvailable;
        this._id = data?._id;
        this.seasonId = data?.seasonId;
        this.blacklist = data?.blacklist;
        this.betsChannels = data?.betsChannels;

        this.#data = data;
        this.#rest = rest;

        this.users = new UsersManager(rest, this.id);
        this.betUsers = new BetUsersManager(rest, this.id);
        this.bets = new BetsManager(rest, this.id);
        this.matches = new MatchesManager(rest, this.id);

        this.#init();
    }

    #init() {
        const id = this.id;
        for (let user of this.#data?.users ?? []) {
            this.users.set(user?.id, new User(user, this.#rest, id));
            this.#rest.users.set(user?.id, new User(user, this.#rest, id));
        }

        for (let user of this.#data?.betUsers ?? []) {
            this.betUsers.set(user?.id, new BetUser(user, this.#rest, id));
            this.#rest.betUsers.set(user?.id, new BetUser(user, this.#rest, id));
        }

        for (let bet of this.#data?.bets ?? []) {
            this.bets.set(bet?._id, new Bet(bet, this.#rest, id));
            this.#rest.bets.set(bet?._id, new Bet(bet, this.#rest, id));
        }
        for (let match of this.#data?.matches ?? []) {
            this.matches.set(match?._id, new Match(match, this.#rest, id));
            this.#rest.matches.set(match?._id, new Match(match, this.#rest, id));
        }
        return this.#autoClean();
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
            return value;
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
        const route = Routes.guilds.resource(key, this.id);
        const response = await this.#rest.request('PATCH', route, { set: value });
        this[key] = response;
        return value;
    }

    #autoClean() {
        this.pricesOn = [...new Set(this.pricesOn ?? [])].sort((a, b) => a - b);
        this.pricesAvailable = [...new Set(this.pricesAvailable ?? [])].sort((a, b) => a - b);
    }
}

module.exports = { Guild };
