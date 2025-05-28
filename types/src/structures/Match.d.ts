import { MATCHTYPES } from "../payloads/MatchCreatePayload";

declare enum MATCHSTATUS {
    ON = "ON",           // Match is active
    OFF = "OFF",         // Match is inactive
    CREATED = "CREATED", // Match was created but not started
    SHUTTED = "SHUTTED"  // Match was forcefully closed
}

/**
 * Interface representing a single player.
 */
export declare interface MatchPlayer {
    /** The unique Discord user ID of the player */
    id: string;

    /** The display name of the player */
    name?: string;
}

/**
 * Type alias for an array of match players.
 */
declare type MatchPlayers = MatchPlayer[];

/**
 * Interface for confirmed players including the type of confirmation.
 */
declare interface ConfirmedPlayer {
    /** The unique Discord user ID of the player */
    id: string;

    /** The name of the player */
    name: string;

    /** Type of confirmation, e.g., "manual", "auto", etc. */
    typeConfirm: string;

    setted: boolean;
}

/**
 * Interface representing a channel (text or voice).
 */
declare interface ChannelInfo {
    /** The channel ID */
    id: string;

    /** The name of the channel */
    name: string;
}

/**
 * Interface representing a full match object.
 */
export declare interface Match {
    /** Unique ID for the match (MongoDB ObjectId as string) */
    _id: string;

    guildId: string;
    
    /** All players involved in the match */
    players: MatchPlayers;

    /** Timestamp of when the match was created */
    createdAt: Date;

    /** The main text channel associated with this match */
    matchChannel: ChannelInfo;

    /** Array of associated voice channels */
    voiceChannels: ChannelInfo[];

    /** Type of the match (e.g., 1x1, 2x2...) */
    type: MATCHTYPES;

    /** Current status of the match */
    status: MatchStatusTypesEnum;

    /** Players who won the match */
    winnerTeam: string;

    /** Maximum number of players allowed in the match */
    maximumSize: number;

    /** Discord ID of the match creator */
    creatorId: string;

    /** Team A players */
    teamA: MatchPlayers;

    /** Team B players */
    teamB: MatchPlayers;

    /** Players who lost the match */
    losers: string;

    /** Team leaders or captains */
    leaders: MatchPlayers;

    /** The player who created the match room */
    roomCreator: MatchPlayer;

    /** List of players who confirmed participation, with confirmation type */
    confirmed: ConfirmedPlayer[];

    /** Players marked as MVP (Most Valuable Player) */
    mvpId: string;
}