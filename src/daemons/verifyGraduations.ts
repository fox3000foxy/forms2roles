import { Lesson } from "../types/lesson";
import { LLJTUser } from "../types/user";
import { readJson } from "../utils/databaseUtils";
import fetchGoogleSheet from "../utils/fetchGoogleSheet";

export const daemon = {
    name: "verifyGraduations",
    description: "Verify graduations and update roles accordingly",
    interval: 1 * 60 * 1000, // Run every 1 minute
    async execute() {
        console.log("Running verifyGraduations daemon...");
        const lessons: Lesson[] = await readJson<Lesson[]>("./databases/lessons.json");
        const users: LLJTUser[] = await readJson<LLJTUser[]>("./databases/users.json");

        for (const lesson of lessons) {
            if(!lesson.id) {
                console.warn(`No CSV found for lesson ${lesson.label}, skipping...`);
                continue;
            }
            try {
                const sheetData = await fetchGoogleSheet(lesson.id);
                if (!sheetData || sheetData.length === 0) {
                    console.warn(`No data found in sheet for lesson ${lesson.id}`);
                    continue;
                }
                console.log(`Fetched ${sheetData.length} rows for lesson ${lesson.id}`);
                console.log(sheetData); // Log the first row to inspect its structure
            }
            catch (error) {
                console.error(`Error fetching sheet for lesson ${lesson.id}:`, error);
                continue;
            }
        }
    }
}