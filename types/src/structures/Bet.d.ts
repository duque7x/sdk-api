import { BaseMatch } from "./BaseMatch";
import {
  Confirmed,
  NormalMessage,
  Player,
  STATES,
  BETTYPES,
  REST,
  BetData,
  BasicChannelData,
  BETSTATUS,
} from "../../../index";
import { LogsManager } from "../managers/LogsManager";
import { ChannelManager } from "../managers/ChannelManager";

/**
 * Bet class containing data and methods about the bet in place.
 */
export declare class Bet extends BaseMatch {
  /**
   * The price of the bet
   */
  price: number;

  /**
   * The winner of the match
   */
  winner: string;

  /**
   * The winner of the match
   */
  loser: string;

  /**
   * Who has payed the bet
   */
  payedBy: string;

  /**
   * The mediator of the bet
   */
  mediatorId: string;

  /**
   * The administrator of the bet
   */
  adminId: string;

  /**
   * The confirmed entries from the players
   */
  confirmed: Confirmed[];

  /**
   * The channels of the bet
   */
  channels: ChannelManager;

  /**
   * An array of messages of the bet
   */
  messages: NormalMessage[];

  /**
   * The id of the embed message of the bet
   */
  embedMessageId: string;

  /**
   * The _id of the bet
   */
  _id: string;

  /**
   * The mode of the bet
   */
  mode: string;

  /**
   * The manager of logs in a given bet
   */
  logs: LogsManager;

  /**
   * This is the status of the bet
   */
  status: BETSTATUS;

  /**
   *
   * @param data
   * @param rest
   * @param guildId
   */
  constructor(data: BetData, rest: REST, guildId: string);

  get data(): BetData;

  add<F extends keyof BetData, V = BetData[F]>(field: F, value: V): Promise<V>;
  set<F extends keyof BetData, V = BetData[F]>(key: F, value: V): Promise<V>;

  delete(): Promise<void>;
  remove<F extends keyof BetData, V = BetData[F]>(
    field: F,
    value: V
  ): Promise<V>;

  addPlayer(player: Player): Promise<Player[]>;
  removePlayer(player: Player): Promise<Player[]>;
  addConfirmed(type: string, id: string): Promise<Confirmed>;
  setConfirmed(set: Confirmed[]): Promise<Confirmed[]>;

  setStatus(
    status: STATES | "off" | "on" | "created" | "shutted"
  ): Promise<STATES>;
  setWinner(userId: string): Promise<string>;
  setLoser(userId: string): Promise<string>;

  addChannel(payload: BasicChannelData): Promise<BasicChannelData>;
  addMessage(payload: NormalMessage): Promise<NormalMessage>;
  setChannels(channels: BasicChannelData[]): Promise<BasicChannelData[]>;

  /**
   * Returns a string representation of this structure
   */
  toString(): string;
}
