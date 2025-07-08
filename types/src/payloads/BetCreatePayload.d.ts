import { BETTYPES } from "../../..";

export interface BetPlayer {
    /** The unique Discord user ID of the player */
    id: string;

    /** The display name of the player */
    name: string;
}
export type BetCreatePayload  = {
    type: BETTYPES | "1v1" | "2v2" | "3v3" | "4v4";
    creatorId: string;
    price: number;
    mode: string;
}
