import axios from 'axios';

/**
 * Vercel Serverless Function: /api/properties/[id]
 * Fetches a single property detail from PixxiCRM.
 */

function formatKey(key) {
    const customMap = {
        buildYear: 'Year Built',
        totalFloor: 'Total Floors',
        floor: 'Floor Level',
        parking: 'Parking Spaces',
        occupancy: 'Occupancy Status',
        deposit: 'Security Deposit',
        cheques: 'Payment Terms',
        handoverTime: 'Handover Date',
        totalUnits: 'Total Units',
        maxSize: 'Max Size (Sq.Ft)',
        minSize: 'Min Size (Sq.Ft)',
        bedroomMax: 'Max Bedrooms',
        bedroomMin: 'Min Bedrooms',
        paymentPlan: 'Payment Plan',
        serviceCharge: 'Service Charge',
        acCharge: 'A/C Charge',
        hasMortgage: 'Has Mortgage',
        completionStatus: 'Completion Status',
        priceType: 'Price Type',
        bathrooms: 'Bathrooms'
    };
    if (customMap[key]) return customMap[key];
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function formatDynamicDetails(prop, params) {
    const details = [];
    if (prop.propertyId || prop.id) details.push({ label: 'Reference ID', value: prop.propertyId || prop.id });
    if (prop.permitNumber) details.push({ label: 'Permit Number', value: prop.permitNumber });
    if (prop.community) details.push({ label: 'Community', value: prop.community });
    if (prop.developer) details.push({ label: 'Developer', value: prop.developer });
    if (prop.region) details.push({ label: 'Area', value: prop.region });
    if (prop.size) details.push({ label: 'Size', value: `${prop.size} Sq.Ft.` });
    if (prop.isFurniture) details.push({ label: 'Furnishing', value: prop.isFurniture });
    if (prop.createTime) details.push({ label: 'Listed On', value: new Date(prop.createTime).toLocaleDateString() });

    const availDate = prop.rentParam?.rentExpiry || prop.sellParam?.rentExpiry || prop.newParam?.handoverTime;
    if (availDate) details.push({ label: 'Availability Date', value: availDate });
    else if (params.occupancy === 'Vacant') details.push({ label: 'Availability Date', value: 'Immediate' });

    const ignoredKeys = ['position', 'view360', 'videoLink', 'rentExpiry', 'handoverTime', 'floorPlan'];
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (ignoredKeys.includes(key) || value === null || value === '' || value === undefined) continue;
            let finalValue = value;
            if (key === 'cheques' && typeof value === 'string' && !value.toLowerCase().includes('cheque')) finalValue = `${value} Cheques`;
            else if (key === 'hasMortgage') finalValue = (value === 'HAS' || value === 'YES') ? 'Yes' : 'No';
            else if (key === 'floor') {
                const floorNum = parseInt(value, 10);
                if (!isNaN(floorNum)) {
                    if (floorNum <= 5) finalValue = 'Low';
                    else if (floorNum <= 15) finalValue = 'Mid';
                    else finalValue = 'High';
                }
            } else if (key === 'paymentPlan' && typeof value === 'string' && value.startsWith('{')) {
                try {
                    const plan = JSON.parse(value);
                    finalValue = Object.entries(plan).filter(([k, v]) => v && v !== '0').map(([k, v]) => `${v}%`).join(' / ');
                } catch (e) { }
            }
            details.push({ label: formatKey(key), value: finalValue });
        }
    }
    return details;
}

function normalizePropertyDetail(prop) {
    const params = prop.sellParam || prop.rentParam || prop.newParam || {};
    const location = [prop.community, prop.cityName].filter(Boolean).join(', ');
    return {
        id: prop.propertyId || prop.id,
        title: prop.title || 'Luxury Property',
        listingType: prop.listingType ? prop.listingType.toUpperCase() : 'SELL',
        price: prop.price || null,
        currency: 'AED',
        pricePeriod: prop.listingType === 'RENT' ? ' / year' : '',
        location: location || 'Dubai',
        mainImageUrl: (prop.photos && prop.photos.length > 0) ? prop.photos[0] : 'https://images.unsplash.com/photo-1613490901237-811550c604be?q=80&w=2000&auto=format&fit=crop',
        gallery: prop.photos || [],
        dynamicDetails: formatDynamicDetails(prop, params),
        listedBy: prop.agent ? prop.agent.name : 'Ophir Agent',
        agentAvatarUrl: (prop.agent && prop.agent.avatar) ? prop.agent.avatar : null,
        description: prop.description || null,
        bedrooms: prop.bedRooms || 0,
        bathrooms: params.bathrooms || 1,
        areaSqft: prop.size || 0,
        labels: prop.propertyType && prop.propertyType.length > 0 ? prop.propertyType : ['Exclusive']
    };
}

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query; // Search for [id] in path
    const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
    const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

    try {
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, { size: 1000 }, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });
        const list = response.data?.data?.list;
        if (!list) return res.status(404).json({ error: 'Property not found' });

        const target = list.find(p => String(p.id) === String(id) || String(p.propertyId) === String(id));
        if (!target) return res.status(404).json({ error: 'Property not found' });

        return res.status(200).json(normalizePropertyDetail(target));
    } catch (error) {
        res.status(500).json({ error: 'CRM Fetch Failed' });
    }
}
