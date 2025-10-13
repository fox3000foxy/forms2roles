import { User } from "discord.js"

export interface LLJTUserBase extends User {
    email?: string;
}

export type LLJTUser = LLJTUserBase;