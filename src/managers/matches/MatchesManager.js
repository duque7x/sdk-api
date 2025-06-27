/* eslint-disable no-unused-private-class-members */
const { Collection } = require("../../structures/Collection");
const { Match } = require("../../structures/Match");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.MatchesManager = class MatchesManager {
  #matches;
  #rest;

  constructor(data, rest) {
    this.#rest = rest;
    this.#matches = new Collection();

    this.guildId = data?.guildId;
    this.#updateMatches(data?.matches);
  }
  get cache() {
    return this.#matches;
  }

  set(id, match) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);
    match = match instanceof Match ? match : new Match(match, this.#rest, this.guildId, this);
    this.#set(match);
    return;
  }
  async fetch(id) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);

    const route = Routes.guilds.matches.get(id, this.guildId);
    const response = await this.#rest.request("GET", route);
    const match = new Match(response, this.#rest, this.guildId);

    this.#set(match);
    return match;
  };
  async fetchAll() {
    const route = Routes.guilds.matches.getAll(this.guildId);
    const response = await this.#rest.request("GET", route);

    await this.#matches.clear();

    for (let matchData of response) {
      const match = new Match(matchData, this.#rest, this.guildId);
      this.#set(match);
    }
    return this.#matches;
  };

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.type && typeof payload.type === "string", "Payload type must be an element of BETTYPES");
    assert(payload.creator && typeof payload.creator === "object", "Payload creator must include creator");

    const route = Routes.guilds.matches.getAll(this.guildId);
    const reponse = await this.#rest.request('POST', route, payload);
    const match = new Match(reponse, this.#rest, this.guildId);
    this.#set(match);

    return match;
  }

  #set(match) {
    return this.#matches.set(match._id, match);
  }
  #updateMatches(data) {
    for (let match of data || []) this.#set(match);
  }
  #removeIdFromCache(id) {
    this.#matches.delete(id);
  }
}