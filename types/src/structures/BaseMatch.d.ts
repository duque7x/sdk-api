import { BETTYPES, MATCHSTATUS, MATCHTYPES, Players, STATES } from "../../..";
import { REST } from "../rest/REST";
import { Bet } from "./Bet";
import { Match } from "./Match";

export class BaseMatch {
  /**
   * This is the base for a match or queue
   * @param data Bet or a Match
   * @param rest Instance of REST
   */
  constructor(data: Match | Bet, rest: REST);

  /**
   * The unique id of the match
   */
  _id: string;

  /**
   * The maximum size of players in a match
   */
  maximumSize: number;

  /**
   * The creator id of the match
   */
  creatorId: string;

  /**
   * An array of the players in the given match
   */
  players: Players;

  /**
   * A string of the guild id
   */
  guildId: string;

  /**
   * The date of the creation of the match
   */
  createdAt: Date;

  /**
   * The last date where the match was updated
   */
  updatedAt: Date;

  /**
   * Returns a string representation of this structure
   */
  toString(): string;
}
