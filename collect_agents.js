import axios from 'axios';
import 'dotenv/config';

const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

async function collectAgents() {
    console.log('--- Collecting Agents from Properties ---');
    try {
        // Try to fetch objects from properties to see embedded agent data
        const payload = { size: 100, page: 1, status: 'ACTIVE' };
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        const properties = response.data?.data?.list || [];
        console.log(`Checking ${properties.length} properties...`);

        const agentsMap = new Map();

        properties.forEach(prop => {
            if (prop.agent && prop.agent.name) {
                const name = prop.agent.name;
                if (!agentsMap.has(name)) {
                    agentsMap.set(name, {
                        name: name,
                        phone: prop.agent.phone || 'N/A',
                        whatsapp: prop.agent.whatsapp || 'N/A',
                        email: prop.agent.email || 'N/A',
                        avatar: prop.agent.avatar || 'N/A'
                    });
                }
            }
        });

        console.log(`\nFound ${agentsMap.size} unique agents:\n`);
        agentsMap.forEach(agent => {
            console.log(`Name: ${agent.name}`);
            console.log(`WhatsApp: ${agent.whatsapp}`);
            console.log(`Phone: ${agent.phone}`);
            console.log(`Email: ${agent.email}`);
            console.log('-----------------------------');
        });

        // Also test if agents endpoint works with POST
        console.log('\n--- Testing POST /pixxiapi/v1/agents ---');
        try {
            const agentResponse = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/agents`, {}, {
                headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
            });
            console.log('POST /agents Success:', JSON.stringify(agentResponse.data, null, 2));
        } catch (e) {
            console.log('POST /agents Failed:', e.message);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

collectAgents();
