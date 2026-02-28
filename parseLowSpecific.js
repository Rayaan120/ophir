import axios from 'axios';
const url = 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties';
const token = 'dNrBq19MA8NsOU0Vyw5UNEDcwIsPQgx-';

async function scanSpecific() {
    try {
        const res = await axios.post(url, { size: 1000 }, { headers: { 'X-PIXXI-TOKEN': token } });
        const list = res.data.data.list;
        const prop = list.find(p => String(p.id) === '155879' || String(p.propertyId) === '155879');

        if (prop) {
            let jsonStr = JSON.stringify(prop);
            if (jsonStr.toLowerCase().includes('low')) {
                console.log('Found "Low" inside property 155879 payload!');
                const regex = /"([a-zA-Z0-9_]+)":"([^"]*[lL][oO][wW][^"]*)"/g;
                let match;
                while ((match = regex.exec(jsonStr)) !== null) {
                    console.log('KEY:', match[1], '-> VALUE:', match[2]);
                }
            } else {
                console.log('"Low" does not exist anywhere in the JSON payload for 155879.');
                console.log('rentParam floor:', prop.rentParam?.floor);
                console.log('sellParam floor:', prop.sellParam?.floor);
            }
        } else {
            console.log('Property 155879 genuinely not found in CRM listing array.');
        }
    } catch (e) { console.error('Error:', e.message); }
}
scanSpecific();
