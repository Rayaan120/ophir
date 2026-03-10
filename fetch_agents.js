import axios from 'axios';
import 'dotenv/config';

const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

async function fetchAgents() {
    console.log('--- Fetching Agents from PixxiCRM ---');
    try {
        const response = await axios.get(`${PIXXI_API_URL}/pixxiapi/v1/agents`, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        const agents = response.data?.data || [];
        console.log(`Found ${agents.length} agents.\n`);

        agents.forEach(agent => {
            console.log(`Name: ${agent.name}`);
            console.log(`WhatsApp: ${agent.whatsapp || 'N/A'}`);
            console.log(`Phone: ${agent.phone || 'N/A'}`);
            console.log(`Email: ${agent.email || 'N/A'}`);
            console.log('-----------------------------');
        });

        if (agents.length === 0) {
            console.log('No agents found or unexpected response format:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('Error fetching agents:', error.response ? error.response.status : error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

fetchAgents();
