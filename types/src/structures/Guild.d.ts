import { MatchesManager } from "../managers/MatchesManager";
import { UserManager } from "../managers/UserManager";
import { BetsManager } from "../managers/BetsManager";
import { BetUsersManager } from "../managers/BetUsersManager";
import { REST } from "../rest/REST";
import { MATCHTYPES } from "../payloads/MatchCreatePayload";
import { BETTYPES } from "../payloads/BetCreatePayload";
import { Collection } from "./Collection";

interface GuildData {
    prefix: string;
    id: string;
    name: string;

    _id: string;
    pricesOn: number[];
    pricesAvailable: number[];
    state: {
        matcheStatus: string,
        rankStatus: string
    };
    seasonId: string;
    betsChannelId: string;
    mediators: Collection<string, { name: string, id: string, joinedAt: Date, paymentLinks: string[] }>;
}

export class Guild {
    prefix: string;
    id: string;
    seasonId: string;
    mediators: Collection<string, { name: string, id: string, joinedAt: Date, paymentLinks: string[] }>;
    betsChannels: {
        "1v1": string,
        "2v2": string,
        "3v3": string,
        "4v4": string,
    } | Record<string, string>;

    name: string;
    _id: string;
    pricesOn: number[];
    pricesAvailable: number[];
    state: { matcheStatus: string, rankStatus: string };

    users: UserManager;
    betUsers: BetUsersManager;
    bets: BetsManager;
    matches: MatchesManager;

    constructor(data: GuildData, rest: REST);

    get data(): GuildData;

    add<F extends keyof KeysAvailable, A = KeysAvailable[F]>(
        key: F,
        value: A
    ): Promise<A>;

    remove<F extends keyof KeysAvailable, A = KeysAvailable[F]>(
        key: F,
        value: A
    ): Promise<A>;

    set<F extends keyof KeysAvailable, A = KeysAvailable[F]>(
        key: F,
        value: A
    ): Promise<A>;
}
export declare enum STATES {
    "ON" = "on",
    "OFF" = "on",
    "CREATED" = "created",
    "SHUTTED" = "shutted",
    "WAITING" = "waiting",
}

type KeysAvailable = {
    blacklist: string[];
    prefix: string;
    pricesOn: number;
    pricesAvailable: number;
    state: {
        state: {
            matchesStatus: STATES,
            rankStatus: STATES
        }
    };
    seasonId: string;

    betsChannels: {
        type: MATCHTYPES | BETTYPES | string,
        id: string
    };

    mediators: { name?: string, id: string, joinedAt?: Date, paymentLinks?: string[] }
};