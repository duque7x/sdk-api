import { BETTYPES } from "../../..";

export interface BetPlayer {
    /** The unique Discord user ID of the player */
    id: string;

    /** The display name of the player */
    name: string;
}
export type BetCreatePayload  = {
    type: BETTYPES;
    creatorId: string;
    price: number;
    mode: string;
}
