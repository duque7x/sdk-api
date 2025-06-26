const { Collection } = require("../../structures/Collection");
const { Bet } = require("../../structures/Bet");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.BetsManager = class BetsManager {
    #bets;
    #rest;
    /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
    constructor(rest, guildId) {
        this.#rest = rest;
        this.#bets = new Collection();
        this.guildId = guildId;
    }
    get cache() {
        return this.#bets;
    }

    set(id, bet) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
        assert(bet && bet instanceof Bet, `${bet} must be an instance of Bet`);

        this.#setBet(bet);
        return bet;
    }
    async fetch(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Mongoose Object Id`);

        const route = Routes.guilds.bets.get(id, this.guildId);
        const payload = { guildId: this.guildId };
        const response = await this.#rest.request("GET", route, payload);
        if (response) {
            const bet = new Bet(response, this.#rest, this.guildId);
            this.#setBet(bet);
            return bet;
        }
        return null;
    };
    async fetchAll() {
        const route = Routes.guilds.bets.getAll(this.guildId);
        const payload = { guildId: this.guildId };
        const response = await this.#rest.request("GET", route, payload);

        await this.#bets.clear();

        for (let betData of response) {
            const bet = new Bet(betData, this.#rest, this.guildId);
            this.#setBet(bet);
        }
        return this.#bets;
    };
    async create(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.type && typeof payload.type === "string", "Payload type must be an element of BETTYPES");
        assert(payload.creatorId && typeof payload.creatorId === "string", "Payload  must include creatorId");
        assert(payload.price && typeof payload.price === "number", "Payload  must include creatorId");

        const route = Routes.guilds.bets.create(this.guildId);
        const response = await this.#rest.request('POST', route, payload);
        const bet = new Bet(response, this.#rest, this.guildId);

        this.#rest.emit("betCreate", bet);
        this.#setBet(bet);
        console.log({ bet });
        
        return bet;
    }
    async delete(id) {
        assert(id && typeof id === "string", "Id must be a Mongoose Object Id");

        const route = Routes.guilds.bets.delete(id, this.guildId);
        const bet = this.#bets.get(id);
        this.#rest.emit("betDelete", bet);

        await this.#rest.request("DELETE", route, { guildId: this.guildId });
        this.#removeIdFromCache(id);
        return;
    };
    async deleteAll() {
        const route = Routes.guilds.bets.deleteAll(this.guildId);
        this.#rest.emit("betsDelete", this.#bets);
        await this.#rest.request("DELETE", route, { guildId: this.guildId });
        this.#bets.clear();
        return;
    };
    #removeIdFromCache(id) {
        this.#bets.delete(id);
    }
    #setBet(bet) {
        if (this.#bets.has(bet._id)) this.#removeIdFromCache(bet._id);
        return this.#bets.set(bet._id, bet);
    }
}