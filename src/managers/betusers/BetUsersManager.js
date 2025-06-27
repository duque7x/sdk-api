const { Collection } = require("../../structures/Collection");
const { BetUser } = require("../../structures/BetUser");
const Routes = require("../../rest/Routes");
const assert = require('node:assert');

exports.BetUsersManager = class {
  #rest;
  #betUsers;
  /**
    * 
    * @param {import("../../../types/src/rest/REST").REST} rest 
    * @param {string} guildId 
    */
  constructor(data, rest) {
    this.#rest = rest;
    this.#betUsers = new Collection();

    this.guildId = data?.guildId;
    this.#updateUsers(data?.betUsers);
  }

  get cache() {
    return this.#betUsers;
  }

  set(id, user) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    return this.#set(user);
  }

  async reset(id, name) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    assert(name && typeof name === "string", `${name} must be a string`);

    const route = Routes.guilds.betUsers.update(id, this.guildId);
    const payload = { name, reset: true };
    const response = await this.#rest.request("DELETE", route, payload);

    const user = this.#set(response.betUsers.find(u => u.id == id));
    return user;
  }
  async resetAll() {
    const route = Routes.guilds.resource("betusers", this.guildId);
    const response = await this.#rest.request("PUT", route);

    this.#set(response);
  }
  async fetch(id, name) {
    assert(id && typeof id === "string", `${id} must be a string and a Discord Snowflake`);
    assert(name && typeof name === "string", `${name} must be a string and must be included`);

    const route = Routes.guilds.betUsers.get(id, this.guildId);
    const payload = { id, name };
    const response = await this.#rest.request("GET", route, payload);

    const user = this.#set(response);
    return user;
  }

  async fetchAll() {
    const route = Routes.guilds.betUsers.getAll(this.guildId);
    const response = await this.#rest.request("GET", route);

    for (let userData of response) {
      this.#set(userData);
    }
    return this.#betUsers;
  }

  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");

    const route = Routes.guilds.betUsers.create(this.guildId);  // Use correct route
    const response = await this.#rest.request("POST", route, payload);
    const user = this.#set(response);

    this.#rest.emit("betUserCreate", user);
    return user;
  }

  async update(id, payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(id && typeof id === "string", "Id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");

    const route = Routes.guilds.betUsers.update(id, this.guildId);  // Use correct route
    const response = await this.#rest.request("PATCH", route, payload);
    const userBefore = this.#betUsers.get(payload.id);
    const user = this.#set(response);

    this.#rest.emit("betUserUpdate", userBefore, user);
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
    const value = await this.#rest.request("DELETE", route, { guildId: this.guildId });
    this.#rest.emit("betUsersDelete", this.#betUsers);
    this.#betUsers.clear();

    return value;
  }

  #removeIdFromCache(id) {
    this.#betUsers.delete(id);
  }
  #set(user) {
    user = user instanceof BetUser ? user : new BetUser(user, this.#rest, this.guildId, this);
    this.cache.set(user.id, user);
    this.#rest.betUsers.set(user.id, user);
    return user;
  }
  #updateUsers(data) {
    for (let user of data ?? []) this.#set(user);
  }
}