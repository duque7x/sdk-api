import { BETTYPES } from "../payloads/BetCreatePayload";
import { REST } from "../rest/REST";
import { BaseMatch } from "./BaseMatch";
import { STATES } from "./Guild";
import {Player} from "../../../index";

export interface Confirmed {
    ids: string[];
    type: string;
    count: number;
}
export interface Channel {
    id: string;
    type: string;
}
export interface BetData {
    type: BETTYPES;
    price: number;
    payedBy: string;
    mediatorId: string;
    confirmed: Confirmed[];
    channels: Channel[];
    status: STATES;
    winner: string;
    loser: string;
    teamA: string;
    teamB: string;
    creatorId: string;
    adminId: string;
    _id: string;
}

/**
 * Bet class containing data and methods about the bet in place.
 */
export declare class Bet extends BaseMatch {
    type: BETTYPES;
    price: number;
    payedBy: string;
    mediatorId: string;
    confirmed: Confirmed[];
    channels: Channel[];
    status: STATES;
    winner: string;
    loser: string;
    teamA: string;
    teamB: string;
    creatorId: string;
    adminId: string;
    _id: string;

    constructor(data: BetData, rest: REST, guildId: string);

    get data(): BetData;

    add<F extends keyof BetData, V = BetData[F]>(field: F, value: V): Promise<V>;
    set<F extends keyof BetData, V = BetData[F]>(key: F, value: V): Promise<V>;

    delete(): Promise<void>;
    remove<F extends keyof BetData, V = BetData[F]>(field: F, value: V): Promise<V>;

    addPlayer(player: Player): Promise<Player[]>;
    removePlayer(player: Player): Promise<Player[]>;
    addConfirmed(type: string, id: string): Promise<Confirmed>;
    setConfirmed(set: Confirmed[]): Promise<Confirmed[]>;

    setStatus(status: STATES): Promise<STATES>;
    setWinner(userId: string): Promise<string>;
    setLoser(userId: string): Promise<string>;

    addChannel(payload: Channel): Promise<Channel>;
    setChannels(channels: Channel[]): Promise<Channel[]>;
}
