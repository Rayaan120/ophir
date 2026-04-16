import 'dotenv/config';
import axios from 'axios';

const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

async function check() {
    try {
        const payload = { size: 1000, page: 1, status: 'ACTIVE' };
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
                headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });
        
        const rawProperties = response.data?.data?.list || [];
        let items = rawProperties.map(prop => {
            const params = prop.sellParam || prop.rentParam || prop.newParam || {};
            const location = [prop.community, prop.cityName].filter(Boolean).join(', ');

            return {
                title: prop.title || 'Luxury Property',
                description: prop.description || 'Discover this stunning luxury property.',
                location: location || 'Dubai'
            };
        });
        
        const searchAD = 'abu dhabi';
        const adItems = items.filter(item => 
            item.title.toLowerCase().includes(searchAD) ||
            item.location.toLowerCase().includes(searchAD) ||
            item.description.toLowerCase().includes(searchAD)
        );
        
        const searchRAK = 'ras al khaimah';
        const rakItems = items.filter(item => 
            item.title.toLowerCase().includes(searchRAK) ||
            item.location.toLowerCase().includes(searchRAK) ||
            item.description.toLowerCase().includes(searchRAK)
        );

        console.log('Server mapped Abu Dhabi properties:', adItems.length);
        console.log('Server mapped RAK properties:', rakItems.length);

        if (adItems.length === 0) {
            console.log("Why 0 AD? Let's check the ones we found earlier directly from rawProperties");
            const rawAD = rawProperties.filter(p => [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('abu dhabi'));
            console.log(JSON.stringify(rawAD.map(p => ({community: p.community, cityName: p.cityName, title: p.title, description: p.description})), null, 2));
        }

        if (rakItems.length === 0) {
            console.log("Why 0 RAK?");
            const rawRAK = rawProperties.filter(p => [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('ras al khaimah') || [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('rak'));
            console.log(JSON.stringify(rawRAK.map(p => ({community: p.community, cityName: p.cityName, title: p.title, description: p.description})), null, 2));
        }
        
    } catch(e) {
        console.error(e.message);
    }
}
check();
