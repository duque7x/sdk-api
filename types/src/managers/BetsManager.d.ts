import { REST } from "./REST";
import { Bet } from "../structures/Bet";
import { Collection } from "../structures/Collection";
import { BetCreatePayload } from "../payloads/BetCreatePayload";

/**
 * Routes handler for bet-related API operations.
 */
export class BetsManager {
  /**
   * REST client used to make HTTP requests.
   */
  rest: REST;

  /**
   * Creates a new BetsManager instance.
   * @param rest - An instance of the REST client.
   */
  constructor(rest: REST);

  /**
   * @returns Collection of bets
   */
  get cache(): Collection<string, Bet>;

  /**
   * Fetches a bet by its ID.
   * @param id - The unique ID of the bet.
   * @returns A promise resolving to the bet data.
   */
  fetch(id: string): Promise<Bet>;

  /**
  * Fetches all bets in a guild
  * @returns Collection of bets
  */
  fetchAll(): Promise<Collection<string, Bet>>;

  /**
   * Creates a new bet.
   * @param payload - The payload to create the bet with.
   * @returns A promise resolving to the created bet data.
   */
  create(payload: BetCreatePayload): Promise<Bet>;

  /**
   * Delets a bet by its ID.
   * @param id - The unique ID of the bet.
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
  * Delets all bets in a guild
  * @returns Promise void
  */
  deleteAll(): Promise<void>;
}
