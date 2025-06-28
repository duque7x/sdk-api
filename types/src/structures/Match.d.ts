import { ChannelInfo, ConfirmedPlayer, MATCHSTATUS, MATCHTYPES, Player, Players, STATES } from "../../..";
import { BaseMatch } from "./BaseMatch";


/**
 * Interface representing a full match object.
 */
export declare class Match extends BaseMatch {
    /** The main text channel associated with this match */
    matchChannel: ChannelInfo;

    /** Array of associated voice channels */
    voiceChannels: ChannelInfo[];

    /** Players who won the match */
    winnerTeam: string;

    /** Maximum number of players allowed in the match */
    maximumSize: number;

    /** Discord ID of the match creator */
    creatorId: string;

    /** Team A players */
    teamA: Players;

    /** Team B players */
    teamB: Players;

    /** Team leaders or captains */
    leaders: Players;

    /** The player who created the match room */
    roomCreator: Player;

    /** List of players who confirmed participation, with confirmation type */
    confirmed: ConfirmedPlayer[];

    /** Players marked as MVP (Most Valuable Player) */
    mvpId: string;

    /**
     * The winners of the match
     */
    winners: string;

    
    /**
     * The winners of the match
     */
    losers: string;
    addPlayer(id: string, name: string): Promise<Match>;
    removePlayer(id: string): Promise<Match>;

    setStatus(status: MATCHSTATUS): Promise<Match>;

    /**
     * Returns a string representation of this structure
     */
    toString(): string;
}