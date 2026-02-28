import axios from 'axios';
import fs from 'fs';
const url = 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties';
const token = 'dNrBq19MA8NsOU0Vyw5UNEDcwIsPQgx-';

async function scan() {
    try {
        const res = await axios.post(url, { size: 100 }, { headers: { 'X-PIXXI-TOKEN': token } });
        const list = res.data.data.list;
        fs.writeFileSync('dump.json', JSON.stringify(list, null, 2));
        console.log('Dumped 100 properties to dump.json');
    } catch (e) { console.error('Error:', e.message); }
}
scan();
