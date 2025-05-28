export enum BETTYPES {
    OneVOne = "1v1",
    TwoVTwo = "2v2",
    ThreeVThree = "3v3",
    FourVFour = "4v4",
}

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
}
