export default async function fetchGoogleSheet(id: string) {
    // first, lets fetch the google sheet
    const link = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
    const request = await fetch(link);
    if (!request.ok) {
        throw new Error(`Error fetching Google Sheet: ${request.statusText}`);
    }
    const data = await request.text();
    const rows = data.trim().split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const [header, ...body] = rows;
    const json = body.map(row => {
        const obj: Record<string, string> = {};
        if (header) {
            header.forEach((key, i) => {
                obj[key] = row[i] ?? '';
            });
        }
        return obj;
    });
    return json;
}