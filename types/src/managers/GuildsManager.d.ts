import { CreateGuildPayload } from "../payloads/CreateGuildPayload";
import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";
import { Guild, GuildData } from "../structures/Guild";

export class GuildsManager {
  /**
   * Creates a new GuildsManager instance.
   * @param rest An instance of the REST client
   */
  constructor(rest: REST): void;

  /**
   * Set a guild into the cache
   * @param id The guild's id to set
   * @param guild The guild's data
   */
  set(id: string, guild: GuildData | Guild): Guild;

  /**
   * The guilds in the cache
   */
  get cache(): Collection<string, Guild>;

  /**
   * Creates a new guild with the given data
   * @param payload the guild's data to create
   */
  async create(payload: CreateGuildPayload | Guild): Promise<Guild>;

  /**
   * Fetches a guild with the given id
   * @param id The guild's id to fetch
   */
  async fetch(id: string): Promise<Guild>;

  /**
   * Fetches all guilds in the system
   */
  async fetchAll(): Promise<Collection<string, Guild>>;

  /**
   * Deletes a guild with the given id
   * @param id The guild's id to delete
   */
  async delete(id: string): Promise<Guild>;

  /**
   * Deletes all guilds in the give system with the clientKey
   */
  async deleteAll(): Promise<boolean>;

  /**
   * Cache all guilds in the available clientKey
   */
  async cacheGuilds(): Promise<Collection<string, Guild>>;
}
