/* eslint-disable no-unused-private-class-members */
const { Collection } = require("../../structures/Collection");
const { Mediator } = require("../../structures/Mediator");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");
exports.MediatorsManager = class {
  #rest;
  #mediators;
  constructor(data, rest) {
    this.#rest = rest;
    this.#mediators = new Collection();

    this.guildId = data?.guildId;
    this.#updateMediators(data?.mediators);
  }
  get cache() {
    return this.#mediators;
  }
  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");
    assert(payload.paymentLinks && typeof payload.paymentLinks === "object", "Payload must include paymentLinks");

    const route = Routes.guilds.mediators.create(this.guildId);
    const response = await this.#rest.request("POST", route, payload);

    for (let mediatorData of response.mediators) {
      const mediator = new Mediator(mediatorData, this.#rest, this.guildId, this);
      this.#set(mediator);

      if (mediatorData.id == payload.id) {
        this.#rest.emit("mediatorCreate", mediator);
        return mediator;
      }
    }
  };

  set(id, mediator) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    this.#set(mediator);
    return mediator;
  }

  async fetch(id) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    const route = Routes.guilds.mediators.get(id, this.guildId);
    const response = await this.#rest.request("GET", route);
    const mediator = new Mediator(response, this.#rest, this.guildId, this);

    this.#set(mediator);
    return mediator;
  };

  async fetchAll() {
    const route = Routes.guilds.mediators.getAll(this.guildId);
    const response = await this.#rest.request("GET", route);

    this.#mediators.clear();
    for (let mediatorData of response) {
      const mediator = new Mediator(mediatorData, this.#rest, this.guildId, this);
      this.#set(mediator);
    }
    return this.#mediators;
  };

  async remove(id) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    const route = Routes.guilds.mediators.get(id, this.guildId);
    const response = await this.#rest.request("DELETE", route);
    this.#rest.emit("mediatorDelete", this.#mediators.get(id));

    for (let mediatorData of response.mediators) {
      this.#set(mediatorData.id, mediatorData);
    }
    return this;
  };
  async removeAll() {
    const route = Routes.guilds.mediators.deleteAll(this.guildId);
    const value = await this.#rest.request("DELETE", route);

    this.#mediators.clear();
    return value;
  };
  async update(id, payload) {
    assert(id && typeof id === "string", "Id must be a string");
    assert(payload && typeof payload === "object", "Payload must be an object");

    const route = Routes.guilds.mediators.update(id, this.guildId);
    const response = await this.#rest.request("PATCH", route);

    const medBefore = this.#mediators.get(id);
    const mediator = this.#set(response);

    this.#rest.emit("mediatorUpdate", medBefore, mediator);
    return mediator;
  }
  #set(mediator) {
    mediator = mediator instanceof Mediator ? mediator :
      new Mediator(mediator, this.#rest, this.guildId, this);
    return this.#mediators.set(mediator.id, mediator);
  }
  #removeIdFromCache(id) {
    this.#mediators.delete(id);
  }
  #updateMediators(data) {
    for (let mediator of data || []) this.#set(mediator);
  }
};