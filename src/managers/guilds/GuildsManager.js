const { Collection } = require("../../structures/Collection");
const { Guild } = require("../../structures/Guild");
const Routes = require("../../rest/Routes");
const assert = require('node:assert');

exports.GuildsManager = class GuildsManager {
    #guilds;
    #rest;
    /**
     * 
     */
    constructor(rest) {
        this.#rest = rest;
        this.#guilds = new Collection();
    }
    get cache() {
        return this.#guilds;
    }

    set(id, guild) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
        assert(guild && guild instanceof Guild, `${guild} must be an instance of Guild`);

        this.#guilds.set(id, guild);
        return;
    }

    async fetch(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

        const route = Routes.guilds.get(id);
        const response = await this.#rest.request("GET", route);
        const guild = new Guild(response, this.#rest);

        if (this.#guilds.has(guild.id)) {
            this.#removeIdFromCache(id);
            this.#guilds.set(guild.id, guild);
            return guild;
        }
        this.#guilds.set(guild.id, guild);

        return guild;
    };

    async fetchAll() {
        const route = Routes.guilds.getAll();
        const payload = { guildId: this.guildId };
        const response = await this.#rest.request("GET", route, payload);

        this.#guilds.clear();
        for (let guildData of response) {
            const guild = new Guild(guildData, this.#rest);
            this.#guilds.set(guildData.id, guild);
        }
        return this.#guilds;
    };

    async create(payload) {
        assert(payload && typeof payload === "object", "Payload must be an object");
        assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
        assert(payload.name && typeof payload.name === "string", "Payload must include name");

        const route = Routes.guilds.create();
        const response = await this.#rest.request('POST', route, payload);
        const guild = new Guild(response, this.#rest);

        if (this.#guilds.has(guild.id)) {
            this.#removeIdFromCache(payload.id);
            this.#guilds.set(guild.id, guild);
            return guild;
        }
        this.#guilds.set(guild.id, guild);
        this.#rest.emit("guildCreate", guild);

        return guild;
    }


    async delete(id) {
        assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

        const route = Routes.guilds.get(id);
        await this.#rest.request("DELETE", route);

        this.#rest.emit("guildDelete", this.#guilds.get(id));
        this.#removeIdFromCache(id);
        return;
    };

    async deleteAll() {
        const route = Routes.guilds.getAll();
        await this.#rest.request("DELETE", route);
        this.#rest.emit("guildsDelete", this.#guilds);
        this.#guilds.clear();
        return;
    };
    async cacheGuilds() {
        const TEN_MINUTES = 10 * 60 * 1000;

        const requestGuilds = async () => {
            const route = Routes.guilds.getAll();
            const guilds = await this.#rest.request("GET", route);
            if (!guilds || guilds.error) return new Collection();

            this.#guilds.clear();
            for (const guild of guilds) {
                if (!guild.id) continue;
                this.#guilds.set(guild.id, new Guild(guild, this.#rest));
            }
        };
        await requestGuilds();
        setInterval(() => {
            requestGuilds().then(() => {
                console.log(`[CACHE] Refreshed active guilds`);
            }).catch(console.error);
        }, TEN_MINUTES);
        return this.#guilds;
    }
    #removeIdFromCache(id) {
        this.#guilds.delete(id);
    }
}