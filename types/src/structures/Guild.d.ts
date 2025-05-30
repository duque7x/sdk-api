import { MatchesManager } from "../managers/MatchesManager";
import { UserManager } from "../managers/UserManager";
import { BetsManager } from "../managers/BetsManager";
import { BetUsersManager } from "../managers/BetUsersManager";
import { REST } from "../rest/REST";
import { MATCHTYPES } from "../../../index";
import { BETTYPES } from "../payloads/BetCreatePayload";
import { MediatorsManager } from "../managers/MediatorsManager";

interface GuildData {
    prefix: string;
    id: string;
    name: string;

    _id: string;
    pricesOn: number[];
    pricesAvailable: number[];
    status: GUILDSTATUS;
    seasonId: string;
    betsChannelId: string;
    mediators: MediatorsManager;
}

export class Guild {
    prefix: string;
    id: string;
    seasonId: string;
    betsChannels: {
        "1v1": string,
        "2v2": string,
        "3v3": string,
        "4v4": string,
    } | Record<string, string>;

    channels: {
        "dailyRank": string;
    } | Record<string, string>;

    name: string;
    _id: string;
    pricesOn: number[];
    pricesAvailable: number[];
    status: GUILDSTATUS;

    users: UserManager;
    betUsers: BetUsersManager;
    bets: BetsManager;
    matches: MatchesManager;
    mediators: MediatorsManager;

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
    "OFF" = "off",
    "CREATED" = "created",
    "SHUTTED" = "shutted",
    "WAITING" = "waiting",
}
export declare enum BASESTATUS {
    "ON" = "on",
    "OFF" = "on",
}

type KeysAvailable = {
    blacklist: string[];
    prefix: string;
    pricesOn: number;
    pricesAvailable: number;
    status: GUILDSTATUS;
    seasonId: string;

    betsChannels: {
        type: MATCHTYPES | BETTYPES | string,
        id: string
    };
    channels: {
        type: "dailyRank" | string,
        id: string
    } | Record<string, string>;

    mediators: { name?: string, id: string, joinedAt?: Date, paymentLinks?: string[] };

    createdAt: Date;
    updatedAt: Date;

    dailyRankStatus: string | BASESTATUS;
    matchesStatus: string | BASESTATUS;
    betsStatus: string | BASESTATUS;
};
type GUILDSTATUS = {
    bets: "on" | "off";
    matches: "on" | "off";
    dailyRank: "on" | "off";
}