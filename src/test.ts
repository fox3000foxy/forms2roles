import fetchGoogleSheet from "./utils/fetchGoogleSheet";

fetchGoogleSheet("1s18LFU9j99U1qqu1xpNYAByVRmlVlVDiVeIde5_anTA").then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});