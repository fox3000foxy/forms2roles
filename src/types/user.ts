import { User } from "discord.js"

export interface LLJTUser extends User {
    email?: string;
}