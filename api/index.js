import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for Vercel debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API Route to fetch properties from PixxiCRM (Handle both /api and direct paths for Vercel robustness)
app.get(['/api/properties', '/properties'], async (req, res) => {
    try {
        const isHot = req.query.hot === 'true';
        const type = req.query.type;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || (isHot ? 6 : 12);

        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        if (type === 'commercial') {
            return res.json({ items: [], total: 0, page, pageSize, totalPages: 0 });
        }

        const fetchPixxi = async (listingType, size, currentPage) => {
            const payload = { size, page: currentPage, status: 'ACTIVE' };
            if (listingType) payload.listingType = listingType;

            const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
                headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
            });
            return {
                list: response.data?.data?.list || [],
                total: response.data?.data?.totalSize || 0
            };
        };

        let rawProperties = [];
        const fetchSize = 500;

        if (type === 'sell' || type === 'rent' || type === 'new') {
            const result = await fetchPixxi(type.toUpperCase(), fetchSize, 1);
            rawProperties = result.list;
        } else {
            const result = await fetchPixxi(null, fetchSize, 1);
            rawProperties = result.list;
        }

        let items = rawProperties.map(prop => {
            const params = prop.sellParam || prop.rentParam || prop.newParam || {};
            const location = [prop.community, prop.cityName].filter(Boolean).join(', ');

            return {
                id: prop.id || prop.propertyId,
                title: prop.title || 'Luxury Property',
                description: prop.description || 'Discover this stunning luxury property.',
                category: prop.listingType ? prop.listingType.toLowerCase() : 'sell',
                labels: prop.propertyType && prop.propertyType.length > 0 ? prop.propertyType : ['Exclusive'],
                price: prop.price || 0,
                pricePeriod: prop.listingType === 'RENT' ? ' / year' : '',
                currency: 'AED',
                location: location || 'Dubai',
                bedrooms: prop.bedRooms || 0,
                bathrooms: params.bathrooms || 1,
                areaSqft: prop.size || 0,
                isHot: isHot,
                mainImageUrl: (prop.photos && prop.photos.length > 0)
                    ? prop.photos[0]
                    : 'https://images.unsplash.com/photo-1613490901237-811550c604be?q=80&w=2000&auto=format&fit=crop',
                agentName: prop.agent ? prop.agent.name : 'Ophir Agent',
                agentAvatarUrl: (prop.agent && prop.agent.avatar) ? prop.agent.avatar : null,
                listedOn: prop.createTime || prop.updateTime || null,
                developerName: prop.developer || null,
                status: prop.status || null,
                handoverDate: params.handoverTime || null,
                bedroomRange: (params.bedroomMin && params.bedroomMax) ? `${params.bedroomMin} - ${params.bedroomMax}` : null
            };
        });

        // Apply Filtering (Same as local server.js)
        const search = req.query.search?.toLowerCase();
        const propertyType = req.query.propertyType;
        const bedroomsFilter = req.query.bedrooms;
        const priceMin = parseFloat(req.query.priceMin);
        const priceMax = parseFloat(req.query.priceMax);

        if (search) {
            items = items.filter(item =>
                item.title.toLowerCase().includes(search) ||
                item.location.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search)
            );
        }

        if (propertyType && propertyType !== 'All') {
            items = items.filter(item =>
                item.labels.some(label => label.toLowerCase() === propertyType.toLowerCase())
            );
        }

        if (bedroomsFilter && bedroomsFilter !== 'Any') {
            if (bedroomsFilter === 'Studio') {
                items = items.filter(item => item.bedrooms === 0);
            } else if (bedroomsFilter === '4+') {
                items = items.filter(item => item.bedrooms >= 4);
            } else {
                const beds = parseInt(bedroomsFilter);
                if (!isNaN(beds)) {
                    items = items.filter(item => item.bedrooms === beds);
                }
            }
        }

        if (!isNaN(priceMin)) items = items.filter(item => item.price >= priceMin);
        if (!isNaN(priceMax)) items = items.filter(item => item.price <= priceMax);

        // Sorting
        if (req.query.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (req.query.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
        else items.sort((a, b) => new Date(b.listedOn || 0) - new Date(a.listedOn || 0));

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedItems = items.slice(startIndex, startIndex + pageSize);
        const totalPages = Math.ceil(items.length / pageSize) || 1;

        return res.json({
            items: paginatedItems,
            total: items.length,
            page,
            pageSize,
            totalPages
        });

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Single property details
app.get(['/api/properties/:id', '/properties/:id'], async (req, res) => {
    try {
        const { id } = req.params;
        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        const payload = { size: 1000 };
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        const list = response.data?.data?.list;
        if (!list) return res.status(404).json({ error: 'Property not found' });

        const targetProperty = list.find(p => String(p.id) === String(id) || String(p.propertyId) === String(id));
        if (!targetProperty) return res.status(404).json({ error: 'Property not found' });

        return res.json(normalizePropertyDetail(targetProperty));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch property details' });
    }
});

function formatDynamicDetails(prop, params) {
    const details = [];
    if (prop.propertyId || prop.id) details.push({ label: 'Reference ID', value: prop.propertyId || prop.id });
    if (prop.community) details.push({ label: 'Community', value: prop.community });
    if (prop.developer) details.push({ label: 'Developer', value: prop.developer });
    if (prop.size) details.push({ label: 'Size', value: `${prop.size} Sq.Ft.` });

    const formatKey = (key) => {
        const customMap = {
            handoverTime: 'Handover Date',
            paymentPlan: 'Payment Plan',
            bathrooms: 'Bathrooms'
        };
        return customMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    if (params) {
        const ignoredKeys = ['position', 'view360', 'videoLink', 'rentExpiry', 'handoverTime', 'floorPlan'];
        for (const [key, value] of Object.entries(params)) {
            if (ignoredKeys.includes(key)) continue;
            if (value === null || value === '' || value === undefined) continue;
            details.push({ label: formatKey(key), value });
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
        location: location || 'Dubai',
        mainImageUrl: (prop.photos && prop.photos.length > 0) ? prop.photos[0] : null,
        gallery: prop.photos || [],
        dynamicDetails: formatDynamicDetails(prop, params),
        description: prop.description || null,
        bedrooms: prop.bedRooms || 0,
        bathrooms: params.bathrooms || 1,
        areaSqft: prop.size || 0,
        labels: prop.propertyType || ['Exclusive']
    };
}

app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'API is live', timestamp: new Date() }));

export default app;
