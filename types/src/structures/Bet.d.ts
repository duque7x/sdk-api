import { BETTYPES } from "../payloads/BetCreatePayload";
import { REST } from "../rest/REST";
import { BaseMatch } from "./BaseMatch";
import { STATES } from "./Guild";
import { MatchPlayer } from "./Match";

type BetData = {
    type: BETTYPES;

    price: string;
    payedBy: string;
    adminId: string;

    confirmed: [{
        ids: string[];
        typeConfirm: string;
        confirmedCount: number;
    }];

    textChannel: {
        id: string;
    };
    waintingChannel: {
        id: string;
    };

    channels: [{
        id: string;
        type: string;
    }];

    status: STATES;
}

export declare class Bet extends BaseMatch {
    constructor(data: BetData, rest: REST, guildId: string);

    type: BETTYPES;
    confirmed: [{
        ids: string[];
        typeConfirm: string;
        confirmedCount: number;
    }];


    price: string;
    payedBy: string;

    textChannel: string;
    waintingChannel: string;

    status: STATES;

    teamA: string;
    teamB: string;
    creatorId: string;
    adminId: string;

    channels: [{
        id: string;
        type: string;
    }];

    _id: string;

    get data(): BetData;

    delete(): Promise<void>;

    add<F extends keyof BetData, V = BetData[F]>(field: F, value: V): Promise<V>;

    remove<F extends keyof BetData, V = BetData[F]>(field: F, value: V): Promise<V>;

    set<F extends keyof BetData, V = BetData[F]>(key: F, value: V): Promise<V>;

    addPlayer(player: MatchPlayer): Promise<MatchPlayer[]>;
    removePlayer(player: MatchPlayer): Promise<MatchPlayer[]>;
}

