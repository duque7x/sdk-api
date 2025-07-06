import { REST } from "./../rest/REST";
import { User } from "../structures/User";
import { UserCreatePayload } from "../payloads/UserCreatePayload";
import { Collection } from "../structures/Collection";

/**
 * Routes handler for user-related API operations.
 */
export declare class UserManager {
  /**
   * REST client used to make HTTP requests.
   */
  rest: REST;

  /**
   * Creates a new UsersRoutes instance.
   * @param rest - An instance of the REST client.
   */
  constructor(rest: REST);

  /**
   * Fetches a user by its ID.
   * @param id - The unique ID of the user.
   * @returns A promise resolving to the user data.
   */
  fetch(id: string, name: string): Promise<User>;

  /**
   * Returns all users on cache
   */
  get cache(): Collection<string, User>;

  /**
   * Creates a new user.
   * @param payload - The payload to create the user with.
   * @returns A promise resolving to the created user data.
   */
  create(payload: UserCreatePayload): Promise<User>;
  create(payload: User): Promise<User>;

  /**
   * Deletes the given user
   * @param id The unique ID of the user.
   */
  delete(id: string): Promise<void>;

  /**
   * Deletes all users on the database
   */
  deleteAll(): Promise<void>;

  /**
   *
   * @param id The unique id of the user
   * @param payload The data that will be updated on the database
   */
  update(id: string, payload: UserUpdatePayload): Promise<User>;
  update(id: string, payload: User): Promise<User>;

  /**
   * Fetches all users in the guild
   * @returns a collection of users
   */
  fetchAll(): Promise<Collection<string, User>>;
}
