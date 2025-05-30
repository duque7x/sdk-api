const { Collection } = require("../../structures/Collection");
const { User } = require("../../structures/User");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

class UsersManager {
  #rest;
  #users;
  constructor(rest, guildId) {
    this.#rest = rest;
    this.#users = new Collection();
    this.guildId = guildId;
  }
  get cache() {
    return this.#users;
  }
  set(id, user) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
    assert(user && user instanceof User, `${user} must be an instance of User`);

    this.#setUser(user);
    return;
  }

  async fetch(id, name) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
    assert(name && typeof name === "string", `${name} must be a string and must be included`);

    const route = Routes.guilds.users.get(id, this.guildId);
    const payload = { guildId: this.guildId };
    const response = await this.#rest.request("GET", route, payload);
    const user = new User(response, this.#rest, this.guildId);

    this.#setUser(user);
    return user;
  };

  async fetchAll() {
    const route = Routes.guilds.users.getAll(this.guildId);
    const payload = { guildId: this.guildId };
    const response = await this.#rest.request("GET", route, payload);

    this.#users.clear();
    for (let userData of response) {
      const user = new User(userData, this.#rest, this.guildId);
      this.#setUser(user);
    }
    return this.#users;
  };


  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");

    const route = Routes.guilds.users.create(this.guildId)
    const response = await this.#rest.request("POST", route, payload)
    const user = new User(response, this.#rest, this.guildId);

    this.#rest.emit("userCreate", user);
    this.#setUser(user);
    return user;
  };

  async delete(id) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    const route = Routes.guilds.users.get(id, this.guildId);
    const payload = { guildId: this.guildId };
    await this.#rest.request("DELETE", route, payload);

    this.#rest.emit("userDelete", this.#users.get(id));
    this.#removeIdFromCache(id);
    return;
  };
  async deleteAll() {
    const route = Routes.guilds.users.deleteAll(this.guildId);
    await this.#rest.request("DELETE", route);

    this.#users.clear();
    return;
  };
  async update(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");
    payload.guildId = this.guildId;

    const route = Routes.guilds.users.get(id, this.guildId);
    const response = await this.#rest.request("PATCH", route, payload);
    const userBefore = this.#users.get(payload.id);
    const user = new User(response, this.#rest, this.guildId);

    this.#rest.emit("userUpdate", userBefore, user);
    this.#setUser(user);

    return user;
  }
  #setUser(user) {
    if (this.#users.has(user.id)) this.#removeIdFromCache(user.id);
    return this.#users.set(user.id, user);
  }
  #removeIdFromCache(id) {
    this.#users.delete(id);
  }
};
exports.UsersManager = UsersManager;