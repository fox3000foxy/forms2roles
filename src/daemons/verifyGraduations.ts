import { Lesson } from "../types/lesson";
import { readJson } from "../utils/databaseUtils";
import fetchGoogleSheet from "../utils/fetchGoogleSheet";

export const daemon = {
    name: "verifyGraduations",
    description: "Verify graduations and update roles accordingly",
    interval: 1 * 60 * 1000, // Run every 1 minute
    async execute() {
        console.log("Running verifyGraduations daemon...");
        const lessons: Lesson[] = await readJson<Lesson[]>("./databases/lessons.json");
        const users = await readJson("./databases/users.json") as Array<{id: string, email: string}>;

        for (const lesson of lessons) {
            if(!lesson.csv) {
                console.warn(`No CSV found for lesson ${lesson.lesson}, skipping...`);
                continue;
            }
            try {
                const sheetData = await fetchGoogleSheet(lesson.csv);
                if (!sheetData || sheetData.length === 0) {
                    console.warn(`No data found in sheet for lesson ${lesson.lesson}`);
                    continue;
                }
                console.log(`Fetched ${sheetData.length} rows for lesson ${lesson.lesson}`);
                console.log(sheetData); // Log the first row to inspect its structure
            }
            catch (error) {
                console.error(`Error fetching sheet for lesson ${lesson.lesson}:`, error);
                continue;
            }
        }
    }
}