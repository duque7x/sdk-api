/* eslint-disable no-unused-private-class-members */
const { Collection } = require("../../structures/Collection");
const { Match } = require("../../structures/Match");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.MatchesManager = class {
  #matches;
  #rest;

  constructor(data, rest) {
    this.#rest = rest;
    this.#matches = new Collection();

    this.guildId = data?.guildId;
    this.#updateMatches(data?.matches);

    console.log({ guildiD: this.guildId, matchesINMANAGER: this.cache.toArray().slice(0, 2) });
  }
  get cache() {
    return this.#matches;
  }
  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.type && typeof payload.type === "string", "Payload type must be an element of BETTYPES");
    assert(payload.creator && typeof payload.creator === "object", "Payload creator must include creator");

    const route = Routes.guilds.matches.getAll(this.guildId);
    const response = await this.#rest.request('POST', route, payload);
    const match = this.#set(response);

    return match;
  }
  set(id, match) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);
    return this.#set(match);
  }
  async fetch(id) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);

    const route = Routes.guilds.matches.get(id, this.guildId);
    const response = await this.#rest.request("GET", route);
    const match = this.#set(response);
    return match;
  };
  async delete(id) {
    assert(id && typeof id === "string", `${id} must be an string or a Mongoose Object Id`);

    const route = Routes.guilds.matches.delete(id, this.guildId);
    const matches =  await this.#rest.request("DELETE", route);
    this.#updateMatches(matches);
    return this.#matches;
  };
  async deleteAll() {
    const route = Routes.guilds.matches.deleteAll(this.guildId);
    const value = await this.#rest.request("GET", route);

    this.#matches.clear();
    return value;
  };
  async fetchAll() {
    const route = Routes.guilds.matches.getAll(this.guildId);
    const response = await this.#rest.request("GET", route);

    this.#matches.clear();

    for (let matchData of response) {
      this.#set(matchData);
    }
    return this.#matches;
  };

  #set(match) {
    match = match instanceof Match ?
      match :
      new Match(match, this.#rest, this.guildId, this);

    this.#matches.set(match._id, match);
    return match;
  }
  #updateMatches(data) {
    for (let match of data ?? []) {
      if (!match && !match._id) continue;
      this.#set(match);
    }
  }
  #removeIdFromCache(id) {
    this.#matches.delete(id);
  }
}