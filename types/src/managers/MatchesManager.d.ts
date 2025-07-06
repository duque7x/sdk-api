import { REST } from "./../rest/REST";
import { Match } from "./../structures/Match";
import { MatchCreatePayload } from "../payloads/MatchCreatePayload";
import { Collection } from "../structures/Collection";

/**
 * Routes handler for match-related API operations.
 */
export class MatchesManager {
  /**
   * REST client used to make HTTP requests.
   */
  rest: REST;

  /**
   * Creates a new MatchesRoutes instance.
   * @param rest - An instance of the REST client.
   */
  constructor(rest: REST);

  /**
   * Returns a collection of matches
   */
  get cache(): Collection<string, Match>;

  /**
   * Creates a new match.
   * @param payload - The payload to create the match with.
   * @returns A promise resolving to the created match data.
   */
  create(payload: MatchCreatePayload): Promise<Match>;

  /**
   * Fetches a match by its ID.
   * @param id - The unique ID of the match.
   * @returns A promise resolving to the match data.
   */
  fetch(id: string): Promise<Match>;

  /**
   * Fetches all matches in a guild
   */
  fetchAll(): Promise<Match>;

  /**
   * Deletes a match by its ID.
   * @param id - The unique ID of the match.
   */
  delete(id: string): Promise<Col>;

  /**
   * Deletes all match by its ID.
   * @param id - The unique ID of the match.
   */
  deleteAll(): Promise<boolean>;
}
