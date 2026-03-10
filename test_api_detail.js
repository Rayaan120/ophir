import axios from 'axios';

async function testPropertyAPI() {
    try {
        // Test with a few known IDs from the previous extraction
        const testIds = [523387, 524208];
        console.log('--- Testing API /api/properties/:id ---');

        for (const id of testIds) {
            const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
            const data = response.data;
            console.log(`Property ID: ${id}`);
            console.log(`Agent Name (listedBy): ${data.listedBy}`);
            console.log(`Agent Phone (agentPhone): ${data.agentPhone}`);
            console.log('-----------------------------');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testPropertyAPI();
