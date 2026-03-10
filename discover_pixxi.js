import axios from 'axios';
import 'dotenv/config';

const PIXXI_API_URL = process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae';
const PIXXI_API_KEY = process.env.PIXXI_CRM_API_KEY;

const endpoints = [
    '/pixxiapi/v1/forms',
    '/pixxiapi/v1/lead-forms',
    '/pixxiapi/v1/webhooks',
    '/pixxiapi/v1/settings',
    '/pixxiapi/v1/config',
    '/pixxiapi/v1/agents'
];

async function discover() {
    console.log('--- Discovering PixxiCRM Endpoints ---');
    for (const endpoint of endpoints) {
        try {
            console.log(`Checking ${endpoint}...`);
            const response = await axios.get(`${PIXXI_API_URL}${endpoint}`, {
                headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
            });
            console.log(`Success ${endpoint}:`, response.data);
        } catch (error) {
            console.log(`Failed ${endpoint}: ${error.response ? error.response.status : error.message}`);
        }
    }
}

discover();
