import { Client } from "discord.js";
import { config } from "../config";

export const daemon = {
    name: "defaultRoleGiver",
    description: "Assign a default role to new members",
    interval: 1 * 60 * 1000, // Run every 1 minute
    async execute(client: Client) {
        const staffLabelRoleId = "1427323094737096775";
        const normalLabelRoleId = "1427323203105325267";
        const graduationLabelRoleId = "1427323151422849096";
        const botRoleId = "1427262077025783919";
        // console.log("Running defaultRoleGiver daemon...");
        const guild = client.guilds.cache.get(config.discord.guildId);
        if (!guild) {
            console.error("Guild not found");
            return;
        }
        const members = await guild.members.fetch();
        for (const member of members.values()) {
            if (member.user.bot) {
                // Assign bot role
                if (!member.roles.cache.has(botRoleId)) {
                    try {
                        await member.roles.add(botRoleId);
                        console.log(`Added bot role to ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Failed to add bot role to ${member.user.tag}:`, error);
                    }
                }
            }

            // Add staff, normal and graduation roles if they don't have them
            if (!member.roles.cache.has(normalLabelRoleId)) {
                try {
                    await member.roles.add(normalLabelRoleId);
                    console.log(`Added normal role to ${member.user.tag}`);
                } catch (error) {
                    console.error(`Failed to add normal role to ${member.user.tag}:`, error);
                }
            }
            if (!member.roles.cache.has(staffLabelRoleId)) {
                try {
                    await member.roles.add(staffLabelRoleId);
                    console.log(`Added staff role from ${member.user.tag}`);
                } catch (error) {
                    console.error(`Failed to remove staff role from ${member.user.tag}:`, error);
                }
            }
            if (!member.roles.cache.has(graduationLabelRoleId)) {
                try {
                    await member.roles.add(graduationLabelRoleId);
                    console.log(`Added graduation role from ${member.user.tag}`);
                } catch (error) {
                    console.error(`Failed to remove graduation role from ${member.user.tag}:`, error);
                }
            }
        }
    }
}