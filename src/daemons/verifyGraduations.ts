import { Client } from "discord.js";
import { Lesson } from "../types/lesson";
import { LLJTUser } from "../types/user";
import { readJson } from "../utils/databaseUtils";
import fetchGoogleSheet from "../utils/fetchGoogleSheet";
import { config } from "../config";

export const daemon = {
    name: "verifyGraduations",
    description: "Verify graduations and update roles accordingly",
    interval: 1 * 1 * 1000, // Run every 1 minute
    async execute(client: Client) {
        // console.log("Running verifyGraduations daemon...");
        const lessons: Lesson[] = await readJson<Lesson[]>("./databases/lessons.json");
        const users: LLJTUser[] = await readJson<LLJTUser[]>("./databases/users.json");

        let rolesToAdd: { ratio: number, role: string, userId: string, lesson: string }[] = [];

        for (const lesson of lessons) {
            if (!lesson.id) {
                // console.warn(`No CSV found for lesson ${lesson.label}, skipping...`);
                continue;
            }
            try {
                const sheetData = await fetchGoogleSheet(lesson.id);
                if (!sheetData || sheetData.length === 0) {
                    // console.warn(`No data found in sheet for lesson ${lesson.id}`);
                    continue;
                }
                const rolesToPush = sheetData.map(row => {
                    // console.log(row)
                    const user = users.find(u => u.email === row.email);
                    if (user) {
                        return {
                            ratio: row.ratio as number,
                            role: lesson.role_id as string,
                            lesson: lesson.label,
                            userId: user.id
                        }
                    }
                    return null;
                }).filter(u => !!u);
                rolesToAdd = [...rolesToAdd, ...rolesToPush];
            }
            catch (error) {
                console.error(`Error fetching sheet for lesson ${lesson.id}:`, error);
                continue;
            }
        }

        // Remove duplicates, keep the highest ratio for each user-role pair
        const uniqueRolesToAdd: { ratio: number, role: string, userId: string, lesson: string; }[] = [];
        const seen = new Map<string, number>(); // key: `${userId}-${role}`, value: ratio
        for (const entry of rolesToAdd) {
            const key = `${entry.userId}-${entry.role}`;
            if (!seen.has(key) || seen.get(key)! < entry.ratio) {
                seen.set(key, entry.ratio);
                const existingIndex = uniqueRolesToAdd.findIndex(e => e.userId === entry.userId && e.role === entry.role);
                if (existingIndex !== -1) {
                    uniqueRolesToAdd[existingIndex] = entry;
                }
                else {
                    uniqueRolesToAdd.push(entry);
                }
            }
        }

        // console.log(uniqueRolesToAdd)

        // Adds the role
        for (const entry of uniqueRolesToAdd) {
            const guild = client.guilds.cache.get(config.discord.guildId || "");
            if (!guild) {
                console.error("Guild not found");
                return;
            }
            const member = await guild.members.fetch(entry.userId).catch(() => null);
            if (!member) {
                console.warn(`Member with ID ${entry.userId} not found in guild`);
                continue;
            }
            if (entry.ratio >= 0.8) {
                if (!member.roles.cache.has(entry.role)) {
                    try {
                        const role = guild.roles.cache.get(entry.role);
                        await member.roles.add(role!);
                        const chatChannel = guild.channels.cache.get("1427338649372201000");
                        if (chatChannel && chatChannel.isTextBased()) {
                            await chatChannel.send({
                                content: `🎉 Congratulations <@${entry.userId}> for completing the graduation ${entry.lesson} and earning the role <@&${entry.role}>!`,
                                allowedMentions: { users: [], roles: [] }
                            });
                        }
                        // console.log(`Added role ${entry.role} to user ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Failed to add role ${entry.role} to user ${member.user.tag}:`, error);
                    }
                }
            } else {
                if (member.roles.cache.has(entry.role)) {
                    try {
                        await member.roles.remove(entry.role);
                        // console.log(`Removed role ${entry.role} from user ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Failed to remove role ${entry.role} from user ${member.user.tag}:`, error);
                    }
                }
            }
        }
    }
}