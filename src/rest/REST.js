require("dotenv").config();
const { GuildsManager } = require("../managers/guilds/GuildsManager");
const Routes = require("../rest/Routes");
const { request, Headers } = require('undici');
const { EventEmitter } = require("node:events");
const { Collection } = require("../structures/Collection");

exports.REST = class extends EventEmitter {
  #clientKey;

  constructor(clientKey) {
    super({ captureRejections: true });

    this.guilds = new GuildsManager(this);

    this.users = new Collection();
    this.betUsers = new Collection();
    this.matches = new Collection();
    this.bets = new Collection();

    this.#clientKey = clientKey;
  }

  async init() {
    await this.guilds.cacheGuilds();
  }

  async request(method, path, data) {
    return await this.#requester(method, Routes.base + path, data);
  }

  async #requester(method, url, sendData) {
    const { data } = await this.doShit(method, url, sendData);
    return data;
  };
 async doShit(method, url, dataToSend) {
    method = method.toUpperCase();
    
    const makeRequest = async (clientKey) => {
      const headers = new Headers();
      headers.append("duque-auth", process.env.AUTH);
      headers.append("Content-Type", "application/json");
      headers.append("duque-client-key", clientKey);
      
      const res = await request(url, {
        method,
        headers,
        body: dataToSend !== undefined ? JSON.stringify(dataToSend) : undefined,
      });
  
      const body = await res.body.json();
      const { data, message } = body;
  
      if (message) console.log({ message });
      return { data, message };
    };
  
    try {
      return await makeRequest(this.#clientKey);
    } catch (error) {
      console.error("Initial request failed:", error.message || error);
  
      let tries = 0;
      while (tries < 3) {
        tries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * tries));
        try {
          return await makeRequest(this.#clientKey);
        } catch (err) {
          console.error(`Retry #${tries} failed:`, err.message || err);
        }
      }
  
      throw new Error("All retries failed after 5 attempts");
    }
  }
}