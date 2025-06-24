const { Collection } = require("../../structures/Collection");
const { BetUser } = require("../../structures/BetUser");
const Routes = require("../../rest/Routes");
const assert = require('node:assert');

class BetUsersManager {
  #rest;
  #betUsers;
  /**
     * 
     * @param {import("../../../types/src/rest/REST").REST} rest 
     * @param {string} guildId 
     */
  constructor(rest, guildId) {
    this.#rest = rest;
    this.#betUsers = new Collection();

    this.guildId = guildId;
  }

  get cache() {
    return this.#betUsers;
  }

  set(id, user) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    assert(user, `${user} must be an instance of BetUser`);

    return this.#setUserAndUpdateGuild(user);
  }
  async reset(id, name) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    assert(name && typeof name === "string", `${name} must be a string`);

    const route = Routes.guilds.betUsers.delete(id, this.guildId);
    const payload = { id, name, reset: true };
    const response = await this.#rest.request("DELETE", route, payload);

    const user = new BetUser(response.betUsers.find(u => u.id == id), this.#rest, this.guildId);

    this.#setUserAndUpdateGuild(response);
    return user;
  }
  async resetAll() {
    const route = Routes.guilds.resource("betusers", this.guildId);
    const response = await this.#rest.request("PUT", route);

    this.#setUserAndUpdateGuild(response);
    return void 0;
  }
  async fetch(id, name) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    assert(name && typeof name === "string", `${name} must be a string and must be included`);

    const route = Routes.guilds.betUsers.get(id, this.guildId);
    const payload = { id, name };
    const response = await this.#rest.request("GET", route, payload);

    const user = new BetUser(response, this.#rest, this.guildId);

    this.#setUserAndUpdateGuild(user);
    return user;
  }

  async fetchAll() {
    const route = Routes.guilds.betUsers.getAll(this.guildId);
    const payload = { guildId: this.guildId };
    const response = await this.#rest.request("GET", route, payload);

    this.#betUsers.clear();
    for (let userData of response) {
      const user = new BetUser(userData, this.#rest, this.guildId);
      this.#setUserAndUpdateGuild(user);
    }
    return this.#betUsers;
  }

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");

    const route = Routes.guilds.betUsers.create(this.guildId);  // Use correct route
    const response = await this.#rest.request("POST", route, payload);
    const user = new BetUser(response, this.#rest, this.guildId);

    this.#setUserAndUpdateGuild(user);
    this.#rest.emit("betUserCreate", user);
    return user;
  }

  async update(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");
    payload.guildId = this.guildId;

    const route = Routes.guilds.betUsers.update(payload.id, this.guildId);  // Use correct route
    const response = await this.#rest.request("PATCH", route, payload);
    const userBefore = this.#betUsers.get(payload.id);
    const user = new BetUser(response, this.#rest, this.guildId);

    this.#rest.emit("betUserUpdate", userBefore, user);
    this.#setUserAndUpdateGuild(user);

    return user;
  }

  async delete(id) {
    assert(id && typeof id === "string", "Id must be a string");

    const route = Routes.guilds.betUsers.delete(id, this.guildId);
    await this.#rest.request("DELETE", route, { guildId: this.guildId });

    this.#rest.emit("betUserDelete", this.#betUsers.get(id));
    this.#removeIdFromCache(id);
    return this.#betUsers;
  }

  async deleteAll() {
    const route = Routes.guilds.betUsers.deleteAll(this.guildId);
    await this.#rest.request("DELETE", route, { guildId: this.guildId });
    this.#rest.emit("betUsersDelete", this.#betUsers);
    this.#betUsers.clear();
  }

  #removeIdFromCache(id) {
    this.#betUsers.delete(id);
  }
  #setUserAndUpdateGuild(data) {
    if (this.#betUsers.get(data.id)) this.#removeIdFromCache(data.id);
    return this.#betUsers.set(data.id, data);
  }
}

exports.BetUsersManager = BetUsersManager;