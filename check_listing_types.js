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
        
        const adItems = rawProperties.filter(p => [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('abu dhabi'));
        const rakItems = rawProperties.filter(p => [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('ras al khaimah') || [p.cityName, p.region, p.community].join(' ').toLowerCase().includes('rak'));

        console.log('Abu Dhabi properties Listing types:', [...new Set(adItems.map(p => p.listingType))]);
        console.log('RAK properties Listing types:', [...new Set(rakItems.map(p => p.listingType))]);

        // Are there any that are 'SELL' or 'RENT'?
        
    } catch(e) {
        console.error(e.message);
    }
}
check();
