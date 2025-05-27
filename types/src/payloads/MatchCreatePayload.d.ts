export enum MATCHTYPES {
    OneVOne = "1v1",
    TwoVTwo = "2v2",
    ThreeVThree = "3v3",
    FourVFour = "4v4",
    FiveVFive = "5v5",
    SixVSix = "6v6",
}

export interface MatchCreatePayload {
    type: MatchTypes;
    creatorId: string;
    maximumSize: number;
}
