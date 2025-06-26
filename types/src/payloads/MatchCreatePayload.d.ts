import { MATCHTYPES } from "../../..";

export interface MatchCreatePayload {
    type: "1v1" | "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "1x1" | "2x2" | "3x3" | "4x4" | "5x5" | "6x6";
    creator: { id: string, name: string };
    maximumSize: number;
}