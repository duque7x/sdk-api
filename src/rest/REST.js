/* eslint-disable no-undef */
require("dotenv").config();
const { GuildsManager } = require("../managers/guilds/GuildsManager");
const assert = require("node:assert");
const Routes = require("../rest/Routes");
const { request, Headers } = require('undici');
const { EventEmitter } = require("node:events");
const { Collection } = require("../structures/Collection");

exports.REST = class extends EventEmitter {
  constructor(clientKey) {
    super({ captureRejections: true });

    this.guilds = new GuildsManager(this);

    this.users = new Collection();
    this.betUsers = new Collection();
    this.matches = new Collection();
    this.bets = new Collection();

    this.clientKey = clientKey;
  }
  setClientKey(key) {
    assert(key && typeof key === "string", "Client key must be a string!");
    this.clientKey = key;
    return this;
  }
  async init() {
    await this.guilds.cacheGuilds();
  }

  async request(method, path, data) {
    if (!this.clientKey) throw new Error("Client Key was not given.")
    return await this.#requester(method, Routes.base + path, data);
  }

  async #requester(method, url, data) {
    const makeRequest = async () => {
      if (process.env.DEV == 'true') console.log({ request: `${method} ${url}` });
      method = method.toUpperCase();

      const headers = new Headers();
      headers.append("duque-auth", process.env.AUTH);
      headers.append("Content-Type", "application/json");
      headers.append("duque-client-key", this.clientKey);

      const res = await request(url, {
        method,
        headers,
        body: data !== undefined ? JSON.stringify(data) : undefined,
      });

      const body = await res.body.json();
      const { data: responseData, message } = body;
      if (message) console.log({ message });

      return responseData;
    }
    try {
      return await makeRequest();
    } catch (error) {
      console.error("Initial request failed:", error.message || error);

      let tries = 0;
      while (tries < 3) {
        tries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * tries));
        try {
          return await makeRequest();
        } catch (err) {
          console.error(`Retry #${tries} failed:`, err.message || err);
        }
      }

      throw new Error("All retries failed after 5 attempts");
    }
  };
}