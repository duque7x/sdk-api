import { REST } from "./REST";
import { User } from "../structures/User";
import { UserCreatePayload } from "../payloads/UserCreatePayload";
import { Collection } from "../structures/Collection";

/**
 * Represents a protection type with additional details.
 */
interface Protection {
  type: "point_protect" | "immunity" | "double_points"; // Type of protection
  longevity: number; // Duration for which the protection lasts
  addedBy: string; // User who added the protection
  when: Date; // When the protection was added
}

/**
 * Represents a channel associated with a player's original channels.
 */
interface OriginalChannel {
  channelId: string; // The ID of the channel
  matchId: string; // The ID of the match associated with the channel
}
interface UserUpdatePayload {
  /**
   * Player's information.
   */
  player?: {
    name?: string; // The player's name
    id?: string; // The player's ID
  };

  /**
   * The number of points the player has.
   * Default: 0
   */
  points?: number;

  /**
   * The number of wins the player has.
   * Default: 0
   */
  wins?: number;

  /**
   * The number of MVPs the player has achieved.
   * Default: 0
   */
  mvps?: number;

  /**
   * The number of losses the player has suffered.
   * Default: 0
   */
  losses?: number;

  /**
   * Array of games played by the player.
   * Default: []
   */
  gamesPlayed?: string[];

  /**
   * Indicates whether the player is blacklisted.
   * Default: false
   */
  blacklisted?: boolean;

  /**
   * List of protections the player has.
   * Default: Contains a "point_protect" protection added by the specified user.
   */
  protections?: Protection[];

  /**
   * List of channels that were originally associated with the player.
   * Default: Contains a channel and match ID pair.
   */
  originalChannels?: OriginalChannel[];
}
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
  updateUser(id: string, payload: UserUpdatePayload): Promise<User>;

  /**
  * Returns all users
  */
  cacheUsers(): Promise<Collection<string, User>>
}
