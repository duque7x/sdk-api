import { REST } from "../rest/REST";
import { Player } from "../structures/BaseUser";
import { BetUser, BetUserData } from "../structures/BetUser";
import { Collection } from "../structures/Collection";

export class BetUsersManager {
  /**
   * Creates a new BetsManager instance.
   * @param data The bet users in a given guild
   * @param rest An instance of the REST client
   */
  constructor(data: BetUserData[], rest: REST);

  /**
   * Creates a user in a guild
   * Returns the user if already created
   * @param payload
   */
  create(payload: Player): Promise<BetUser>;

  /**
   * Returns a collection of users
   */
  get cache(): Collection<string, BetUser>;

  /**
   * Sets an user into the cache
   * @param id The user's id to set
   * @param user the user's data to set
   */
  set(id: string, user: BetUserData): void;
  set(id: string, user: BetUser): void;

  /**
   * Fetches a user from the api
   * Works in a find-or-create mode
   * @param id The user's id
   * @param name The user's name
   */
  fetch(id: string, name: string): Promise<BetUser>;

  /**
   * Fetches all available users in a given guild
   */
  fetchAll(): Promise<Collection<string, BetUser>>;

  /**
   * Update a certain user in the guild
   * @param id The user's id to update
   * @param payload The data to update the user iwth
   */
  update(id: string, payload: BetUserData): Promise<BetUser | undefined>;
  update(id: string, payload: BetUser): Promise<BetUser | undefined>;

  /**
   * Reset a certain user in a guild
   * @param id The user's id to be reset
   * @param name The user's name
   */
  reset(id: string, name: string): Promise<BetUser>;

  /**
   * Reset all users in the guild
   */
  resetAll(): Promise<void>;

  /**
   * Deletes a user with the given id
   * @param id The user's id to delete
   */
  delete(id: string): Promise<void>;

  /**
   * Deletes all user in a guild
   */
  deleteAll(): Promise<boolean>;
}
