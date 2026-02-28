import axios from 'axios';
const url = 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties';
const token = 'dNrBq19MA8NsOU0Vyw5UNEDcwIsPQgx-';

async function scanSource() {
    try {
        const res = await axios.post(url, { size: 1000 }, { headers: { 'X-PIXXI-TOKEN': token } });
        const list = res.data.data.list;
        const prop = list.find(p => String(p.id) === '155879' || String(p.propertyId) === '155879');

        if (prop) {
            let jsonStr = JSON.stringify(prop);
            if (jsonStr.toLowerCase().includes('friend')) {
                console.log('Found "Friend" inside property 155879 payload!');
                for (const [key, value] of Object.entries(prop)) {
                    if (typeof value === 'string' && value.toLowerCase().includes('friend')) {
                        console.log('ROOT KEY MATCH:', key, '->', value);
                    }
                }
            } else {
                console.log('"Friend" does not exist anywhere in the JSON payload for 155879.');
                console.log('--- ENTIRE PAYLOAD DUMP ---');
                console.log(JSON.stringify(prop, null, 2));
            }
        } else {
            console.log('Property 155879 genuinely not found in CRM listing array.');
        }
    } catch (e) { console.error('Error:', e.message); }
}
scanSource();
