import { REST } from "./REST";
import { Match } from "./Match";
import { MatchCreatePayload } from "../payloads/MatchCreatePayload";

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
   * Fetches a match by its ID.
   * @param id - The unique ID of the match.
   * @returns A promise resolving to the match data.
   */
  fetch(id: string): Promise<Match>;

  /**
   * Creates a new match.
   * @param payload - The payload to create the match with.
   * @returns A promise resolving to the created match data.
   */
  create(payload: MatchCreatePayload): Promise<Match>;
}
