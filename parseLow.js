import fs from 'fs';
const data = JSON.parse(fs.readFileSync('dump.json', 'utf8'));

const prop = data.find(p => String(p.id) === '155879' || String(p.propertyId) === '155879');
if (prop) {
    let jsonStr = JSON.stringify(prop);
    if (jsonStr.toLowerCase().includes('low')) {
        console.log('Found "Low" inside property payload!');
        const regex = /\"([a-zA-Z0-9_]+)\":\"([^\"]*[lL][oO][wW][^\"]*)\"/g;
        let match;
        while ((match = regex.exec(jsonStr)) !== null) {
            console.log('KEY:', match[1], '-> VALUE:', match[2]);
        }
    } else {
        console.log('"Low" does not exist anywhere in the payload for 155879.');
    }
} else {
    console.log('Property 155879 not found in top 100 listings.');
}
