import { MatchesManager } from "../managers/MatchesManager";
import { UserManager } from "../managers/UserManager";
import { BetsManager } from "../managers/BetsManager";
import { BetUsersManager } from "../managers/BetUsersManager";
import { REST } from "../rest/REST";
import { MediatorsManager } from "../managers/MediatorsManager";

interface Channel {
    id: string;
    type: string;
}

interface Message {
    id: string;
    type: string;
}
interface Emoji {
    id: string;
    type: string;
    animated: boolean;
}

interface Role {
    id: string;
    type: string;
}
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
interface BlackListed {
    id: string;
    addedBy: string;
    when: Date
}
export class Guild {
    blacklist: BlackListed[];

    prefix: string;
    id: string;
    seasonId: string;

    channels: Channel[];

    categories: Channel[];

    roles: Role[];
    messages: Message[];
    emojis: Emoji[];

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

    setStatus<K extends keyof GUILDSTATUS, V = "on" | "off">(key: K, value: V): Promise<Guild>;

    addRole(type: string, id: string): Promise<Guild>;
    addCategory(type: string, id: string): Promise<Guild>;
    addChannel(type: string, id: string): Promise<Guild>;

    setBlacklist(value: boolean, id: string, adminId: string): Promise<Guild>;

    addMessage(type: string, id: string): Promise<Guild>;
    deleteMessage(type: string, id: string): Promise<Guild>;

    addEmoji(type: string, id: string, animated?: boolean): Promise<Guild>;
    deleteEmoji(type: string, id: string): Promise<Guild>;
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
interface Mediator {
    name?: string;
    id: string, joinedAt?: Date;
    paymentLinks?: string[]
}
type KeysAvailable = {
    blacklist: BlackListed;
    prefix: string;
    pricesOn: number;
    pricesAvailable: number;
    status: GUILDSTATUS;
    seasonId: string;

    mediators: Mediator[];


    channels: {
        dailyRank: Channel;
        blacklist: Channel
    };

    categories: {
        bets: Channel;
        betsChannel: Channel;
    };

    roles: Role[];
};
type GUILDSTATUS = {
    bets: "on" | "off";
    matches: "on" | "off";
    dailyRank: "on" | "off";
    createVoiceChannels: "on" | "off"
}