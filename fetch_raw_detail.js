import axios from 'axios';
import 'dotenv/config';

const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

async function fetchRawDetail() {
    try {
        const id = 523387; // Known property ID
        console.log(`--- Fetching Raw Detail for ID: ${id} ---`);
        const response = await axios.get(`${PIXXI_API_URL}/pixxiapi/v1/properties/${id}`, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        console.log('Raw Data Structure Keys:', Object.keys(response.data.data));
        if (response.data.data.agent) {
            console.log('Agent Object Found:', response.data.data.agent);
        } else {
            console.log('Agent Object NOT found directly.');
            console.log('Checking for portalAgent:', response.data.data.portalAgent);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchRawDetail();
