const { Collection } = require("../../structures/Collection");
const { Match } = require("../../structures/Match");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.MatchesManager = class MatchesManager {
  #matches;
  #rest;

  constructor(rest, guildId) {
    this.#rest = rest;
    this.#matches = new Collection();
    this.guildId = guildId;
  }
  get cache() {
    return this.#matches;
  }

  set(id, match) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);
    assert(match && match instanceof Match, `${match} must be an instace of Match`);

    this.#setMatch(match);
    return;
  }
  async fetch(id) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);

    const route = Routes.guilds.matches.get(id, this.guildId);
    const response = await this.#rest.request("GET", route);
    const match = new Match(response, this.#rest, this.guildId);

    this.#setMatch(match);
    return match;
  };
  async fetchAll() {
    const route = Routes.guilds.matches.getAll(this.guildId);
    const payload = { guildId: this.guildId };
    const response = await this.#rest.request("GET", route, payload);

    await this.#matches.clear();

    for (let matchData of response) {
      const match = new Match(matchData, this.#rest, this.guildId);
      this.#setMatch(match);
    }
    return this.#matches;
  };

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.type && typeof payload.type === "string", "Payload type must be an element of BETTYPES");
    assert(payload.creatorId && typeof payload.creatorId === "string", "Payload  must include creatorId");

    const route = Routes.guilds.matches.getAll(this.guildId);
    const reponse = await this.#rest.request('POST', route, payload);
    const match = new Match(reponse, this.#rest, this.guildId);
    this.#setMatch(match);

    return match;
  }

  #setMatch(match) {
    if (this.#matches.has(match._id)) this.#removeIdFromCache(match._id);
    return this.#matches.set(match._id, match);
  }
  #removeIdFromCache(id) {
    this.#matches.delete(id);
  }
}