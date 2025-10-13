const VERIFIED_ROLE_ID = "1427262130154901614";
import { Client } from "discord.js";
import { readJson} from "../utils/databaseUtils";
import { config } from "../config";
import { LLJTUser } from "../types/user";

export const daemon = {
    name: "manageVerifiedRole",
    description: "Manage the verified role for users based on their verification status",
    interval: 1 * 1 * 1000, // Run every second
    async execute(client: Client) {
        // console.log("Running manageVerifiedRole daemon...");
        const db = await readJson("./databases/users.json") as Array<LLJTUser>;
        const guild = client.guilds.cache.get(config.discord.guildId);

        if (!guild) {
            console.error("Guild not found");
            return;
        }

        const role = guild.roles.cache.get(VERIFIED_ROLE_ID);
        if (!role) {
            console.error("Verified role not found");
            return;
        }

        const members = await guild.members.fetch();

        for (const member of members.values()) {
            const userRecord = db.find(user => user.id === member.id);
            if (userRecord && userRecord.email) {
                // User is verified, ensure they have the role
                if (!member.roles.cache.has(VERIFIED_ROLE_ID)) {
                    try {
                        await member.roles.add(VERIFIED_ROLE_ID);
                        console.log(`Added verified role to ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Failed to add role to ${member.user.tag}:`, error);
                    }
                }
            } else {
                // User is not verified, ensure they do not have the role
                if (member.roles.cache.has(VERIFIED_ROLE_ID)) {
                    try {
                        await member.roles.remove(VERIFIED_ROLE_ID);
                        console.log(`Removed verified role from ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Failed to remove role from ${member.user.tag}:`, error);
                    }
                }
            }
        }
    }
}