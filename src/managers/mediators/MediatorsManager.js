const { Collection } = require("../../structures/Collection");
const { Mediator } = require("../../structures/Mediator");
const Routes = require("../../rest/Routes");
const assert = require("node:assert");

exports.MediatorsManager = class MediatorsManager {
  #rest;
  #mediators;

  constructor(rest, guildId) {
    this.#rest = rest;
    this.#mediators = new Collection();
    this.guildId = guildId;
    
  }
  get cache() {
    return this.#mediators;
  }
  async create(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");
    assert(payload.id && typeof payload.id === "string", "Payload id must be a string");
    assert(payload.name && typeof payload.name === "string", "Payload must include name");
    assert(payload.paymentLinks && typeof payload.paymentLinks === "object", "Payload must include paymentLinks");

    const route = Routes.guilds.mediators.create(this.guildId)
    const response = await this.#rest.request("POST", route, payload)
    const mediator = new Mediator(response, this.#rest, this.guildId);

    this.#rest.emit("mediatorCreate", mediator);
    this.#setMediator(mediator);
    return mediator;
  };

  set(id, mediator) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);
    assert(mediator && mediator instanceof Mediator, `${mediator} must be an instance of Mediator`);

    this.#setMediator(mediator);
    return;
  }

  async fetch(id) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    const route = Routes.guilds.mediators.get(id, this.guildId);
    const response = await this.#rest.request("GET", route);
    const mediator = new Mediator(response, this.#rest, this.guildId);

    this.#setMediator(mediator);
    return mediator;
  };

  async fetchAll() {
    const route = Routes.guilds.mediators.getAll(this.guildId);
    const response = await this.#rest.request("GET", route, payload);

    this.#mediators.clear();
    for (let mediatorData of response) {
      const mediator = new Mediator(mediatorData, this.#rest, this.guildId);
      this.#setMediator(mediator);
    }
    return this.#mediators;
  };

  async delete(id) {
    assert(id && typeof id === "string", `${id} must be a string or a Discord Snowflake`);

    const route = Routes.guilds.mediators.get(id, this.guildId);
    await this.#rest.request("DELETE", route);

    this.#rest.emit("mediatorDelete", this.#mediators.get(id));
    this.#removeIdFromCache(id);
    return;
  };
  async deleteAll() {
    const route = Routes.guilds.mediators.deleteAll(this.guildId);
    await this.#rest.request("DELETE", route);

    this.#mediators.clear();
    return;
  };
  async update(payload) {
    assert(payload && typeof payload === "object", "Payload must be an object");

    const route = Routes.guilds.mediators.update(id, this.guildId);
    const response = await this.#rest.request("PATCH", route);
    const medBefore = this.#mediators.get(payload.id);
    const mediator = new Mediator(response, this.#rest, this.guildId);

    this.#rest.emit("mediatorUpdate", medBefore, mediator);
    this.#setMediator(mediator);

    return mediator;
  }
  async cacheMediators() {
    const TEN_MINUTES = 10 * 60 * 1000;

    const requestMediators = async () => {
      const route = Routes.guilds.mediators.getAll(this.guildId);
      const mediators = await this.#rest.request("GET", route);

      if (!mediators || mediators.error) return new Collection();
      for (const mediatorData of mediators) {
        const mediator = new Mediator(mediatorData, this.#rest, this.guildId);
        this.#setMediator(mediator);
      }
    };
    await requestMediators();

    setInterval(() => {
      requestMediators().then(() => {
        console.log(`[CACHE] Refreshed active mediators`);
      }).catch(console.error); // avoid unhandled rejections
    }, TEN_MINUTES);
    return this.#mediators;
  }
  #setMediator(mediator) {
    if (this.#mediators.has(mediator.id)) this.#removeIdFromCache(mediator.id);
    return this.#mediators.set(mediator.id, mediator);
  }
  #removeIdFromCache(id) {
    this.#mediators.delete(id);
  }
};