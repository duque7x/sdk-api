import { MATCHTYPES } from "../../..";

export interface MatchCreatePayload {
    type: MATCHTYPES;
    creatorId: string;
    maximumSize: number;
}