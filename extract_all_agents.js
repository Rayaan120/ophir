import fs from 'fs';

const propsData = JSON.parse(fs.readFileSync('all_props.json', 'utf8'));
const agentsMap = new Map();

propsData.forEach(prop => {
    if (prop.agent && prop.agent.name) {
        const name = prop.agent.name;
        if (!agentsMap.has(name)) {
            agentsMap.set(name, {
                name: name,
                phone: prop.agent.phone || 'N/A',
                whatsapp: prop.agent.whatsapp || 'N/A',
                email: prop.agent.email || 'N/A'
            });
        }
    }
});

console.log('--- All Unique Agents found in all_props.json ---');
agentsMap.forEach(agent => {
    console.log(`Name: ${agent.name}`);
    console.log(`WhatsApp: ${agent.whatsapp}`);
    console.log(`Phone: ${agent.phone}`);
    console.log(`Email: ${agent.email}`);
    console.log('-----------------------------');
});
