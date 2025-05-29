import { BETTYPES } from "../payloads/BetCreatePayload";
import { MATCHTYPES } from "../payloads/MatchCreatePayload";
import { REST } from "../rest/REST";
import { STATES } from "./Guild";

export declare interface Player {
    /**
     * The unique id of the player
     */
    id: string;

    /**
     * The name of the player
     */
    name: string;
}
/**
 * An array of players
 */
export declare type Players = Player[];

export class BaseMatch {
    constructor(data: any, rest: REST, guildId: string): void;
    type: MATCHTYPES | BETTYPES | string;

    status: STATES;

    winners: string;

    maximumSize: string;

    creatorId: string;

    players: Players;

    guildId: string;

    createdAt: Date;
    updatedAt: Date;
}