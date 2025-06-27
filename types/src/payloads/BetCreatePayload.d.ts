
export interface BetPlayer {
    /** The unique Discord user ID of the player */
    id: string;

    /** The display name of the player */
    name: string;
}
export type BetCreatePayload  = {
    type: BETTYPES | string;
    creatorId: string;
    adminId: string;
    price: number;
    embedMessageId?: string;
    mode: string;
}
