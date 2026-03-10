import fs from 'fs';

const propsData = JSON.parse(fs.readFileSync('all_props.json', 'utf8'));

let missingAgentCount = 0;
let missingPortalAgentCount = 0;
let bothMissingCount = 0;

propsData.forEach(prop => {
    const hasAgent = !!(prop.agent && prop.agent.phone);
    const hasPortalAgent = !!(prop.portalAgent && prop.portalAgent.phone);

    if (!hasAgent) missingAgentCount++;
    if (!hasPortalAgent) missingPortalAgentCount++;
    if (!hasAgent && !hasPortalAgent) bothMissingCount++;
});

console.log(`Total Properties: ${propsData.length}`);
console.log(`Missing Agent: ${missingAgentCount}`);
console.log(`Missing Portal Agent: ${missingPortalAgentCount}`);
console.log(`Both Missing: ${bothMissingCount}`);
