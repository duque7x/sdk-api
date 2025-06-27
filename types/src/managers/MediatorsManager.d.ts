import { Collection } from "../structures/Collection";
import { Mediator } from "../structures/Mediator";
import { REST } from "../rest/REST";



export declare class MediatorsManager {
  /**
   * The guild's id
   */
  guildId: string;

  /**
   * Creates a new MediatorsManager instance.
   * @param data The mediators in a given guild
   * @param rest An instance of the REST client
   */
  constructor(data: MediatorData | Mediator, rest: REST);

  /**
   * Returns a collection of mediators in a guild
   */
  get cache(): Collection<string, Mediator>;

  /**
   * Set a mediator into the cache
   * @param id The mediators id
   * @param mediator Mediator's data
   */
  set(id: string, mediator: MediatorData): Mediator;
  set(id: string, mediator: Mediator): Mediator;

  /**
   * Creates a mediator in the guild
   * @param payload The mediator's data
   */
  create(payload: MediatorData): Promise<Mediator>;
  create(payload: Mediator): Promise<Mediator>;

  /**
   * Fetches a specific mediator in a guild
   * @param id The mediators id
   */
  fetch(id: string): Promise<Mediator | undefined>;

  /**
   * Fetches all mediators in the given guild
   */
  fetchAll(): Collection<string, Mediator>;

  /**
   * Removes a specific mediator in a guild
   * @param id The mediator's id to remove
   */
  remove(id: string): Promise<void>;

  /**
   * Removes all mediators in the guild
   */
  removeAll(): Promise<void>;

  /**
   * Update a specific mediator
   * @param payload The new mediators data
   */
  update(payload: MediatorData): Promise<void>;
  update(payload: Mediator): Promise<void>;
};