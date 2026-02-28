import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route to fetch hot properties from PixxiCRM
app.get('/api/properties', async (req, res) => {
    try {
        const isHot = req.query.hot === 'true';
        const type = req.query.type; // 'sell', 'rent', 'commercial', 'new', or undefined
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || (isHot ? 6 : 12);

        // Read variables explicitly
        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        if (type === 'commercial') {
            // UI-only for now; return empty to smoothly handle the UI
            return res.json({ items: [], total: 0, page, pageSize, totalPages: 0 });
        }

        // Helper function to fetch data from PixxiCRM based on listing type
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
        let totalItems = 0;

        // Fetch a huge chunk so our custom JS sort actually works effectively
        const fetchSize = 500;

        // Determine how to fetch based on "type"
        if (type === 'sell' || type === 'rent' || type === 'new') {
            const result = await fetchPixxi(type.toUpperCase(), fetchSize, 1);
            rawProperties = result.list;
            totalItems = result.total;
        } else {
            // Mixed (All properties request) -> Omit type to fetch everything directly from Pixxi
            const result = await fetchPixxi(null, fetchSize, 1);
            rawProperties = result.list;
            totalItems = result.total;
        }

        let items = rawProperties.map(prop => {
            // Map the schema safely
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
                // Use actual photos if available; otherwise use default mock images for visual testing
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

        // Apply Server-Side Filtering
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

        if (!isNaN(priceMin)) {
            items = items.filter(item => item.price >= priceMin);
        }
        if (!isNaN(priceMax)) {
            items = items.filter(item => item.price <= priceMax);
        }

        // Basic front-end sorting logic to return correctly mapped array elements depending on User preferences
        if (req.query.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (req.query.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
        else items.sort((a, b) => new Date(b.listedOn || 0) - new Date(a.listedOn || 0));

        // Now paginate precisely out of the sorted array
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
        console.error('Error fetching properties from PixxiCRM:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch properties from CRM' });
    }
});

// Fetch single property details by ID (Native fetch and filter due to PixxiCRM payload filtering bugs)
app.get('/api/properties/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        // Fetch enough properties to guarantee we can find the exact match locally
        const payload = { size: 1000 };
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        const list = response.data?.data?.list;
        if (!list || list.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Strictly locate the explicit property requested
        const targetProperty = list.find(p => String(p.id) === String(id) || String(p.propertyId) === String(id));

        if (!targetProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }

        return res.json(normalizePropertyDetail(targetProperty));
    } catch (error) {
        console.error('Error fetching property by ID from PixxiCRM:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch property details from CRM' });
    }
});

function formatDynamicDetails(prop, params) {
    const details = [];

    // Always append foundational fields
    if (prop.propertyId || prop.id) details.push({ label: 'Reference ID', value: prop.propertyId || prop.id });
    if (prop.permitNumber) details.push({ label: 'Permit Number', value: prop.permitNumber });
    if (prop.community) details.push({ label: 'Community', value: prop.community });
    if (prop.developer) details.push({ label: 'Developer', value: prop.developer });
    if (prop.region) details.push({ label: 'Area', value: prop.region });
    if (prop.size) details.push({ label: 'Size', value: `${prop.size} Sq.Ft.` });
    if (prop.isFurniture) details.push({ label: 'Furnishing', value: prop.isFurniture });
    if (prop.createTime) details.push({ label: 'Listed On', value: new Date(prop.createTime).toLocaleDateString() });

    // Handle Availability Formatter
    const availDate = prop.rentParam?.rentExpiry || prop.sellParam?.rentExpiry || prop.newParam?.handoverTime;
    if (availDate) {
        details.push({ label: 'Availability Date', value: availDate }); // Frontend handles Date UI formatting
    } else if (params.occupancy === 'Vacant') {
        details.push({ label: 'Availability Date', value: 'Immediate' });
    }

    // Dynamic Formatter for CamelCase Keys
    const formatKey = (key) => {
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
    };

    // Strip irrelevant data payload keys natively
    const ignoredKeys = ['position', 'view360', 'videoLink', 'rentExpiry', 'handoverTime', 'floorPlan'];

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (ignoredKeys.includes(key)) continue;
            if (value === null || value === '' || value === undefined) continue;

            let finalValue = value;
            if (key === 'cheques' && typeof value === 'string' && !value.toLowerCase().includes('cheque')) {
                finalValue = `${value} Cheques`;
            } else if (key === 'hasMortgage') {
                if (value === 'HAS') finalValue = 'Yes';
                else if (value === 'NOT') finalValue = 'No';
                else if (value === 'NO') finalValue = 'No';
            } else if (key === 'floor') {
                const floorNum = parseInt(value, 10);
                if (!isNaN(floorNum)) {
                    if (floorNum <= 5) finalValue = 'Low';
                    else if (floorNum <= 15) finalValue = 'Mid';
                    else finalValue = 'High';
                }
            } else if (key === 'paymentPlan' && typeof value === 'string' && value.startsWith('{')) {
                try {
                    const plan = JSON.parse(value);
                    // Usually format {"one": "20", "two": "80"} -> "20%, 80%" or similar
                    // For simplicity, converting it to a basic string:
                    finalValue = Object.entries(plan)
                        .filter(([k, v]) => v && v !== '0')
                        .map(([k, v]) => `${v}%`)
                        .join(' / ');
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
        mainImageUrl: (prop.photos && prop.photos.length > 0)
            ? prop.photos[0]
            : 'https://images.unsplash.com/photo-1613490901237-811550c604be?q=80&w=2000&auto=format&fit=crop',
        gallery: prop.photos || [],

        dynamicDetails: formatDynamicDetails(prop, params),
        mortgage: null,
        source: prop.portalAgent ? prop.portalAgent.name : null,
        listedOn: prop.createTime || null,
        listedBy: prop.agent ? prop.agent.name : 'Ophir Agent',
        agentAvatarUrl: (prop.agent && prop.agent.avatar) ? prop.agent.avatar : null,
        description: prop.description || null,

        // Add typical overview numbers as well
        bedrooms: prop.bedRooms || 0,
        bathrooms: params.bathrooms || 1,
        areaSqft: prop.size || 0,
        labels: prop.propertyType && prop.propertyType.length > 0 ? prop.propertyType : ['Exclusive']
    };
}
// Contact Form Submission (PixxiCRM Lead Integration)
app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, email, phone, interest, budget, message, areas, source } = req.body;

        // Validation
        if (!fullName || !email || !phone || !message) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        // Forward to PixxiCRM Lead Webhook
        // Note: In a real scenario, you'd use a specific formId provided by the client.
        // For now, we'll map the fields as traditionally expected by Pixxi webhooks.
        const webhookPayload = {
            name: fullName,
            email: email,
            phone: phone,
            subject: `Enquiry: ${interest}`,
            message: `Interest: ${interest}\nBudget: ${budget}\nAreas: ${areas}\n\nMessage:\n${message}`,
            source: source || 'Website Contact Page',
            formId: 'CONTACT_PAGE_GENERAL'
        };

        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/webhook/v1/form`, webhookPayload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });

        res.json({ success: true, message: 'Thank you for your enquiry. An advisor will contact you shortly.' });
    } catch (error) {
        console.error('Contact Form Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to submit enquiry. Please try again or contact us via WhatsApp.' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running correctly.' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`PixxiCRM API Endpoint active at http://localhost:${PORT}/api/properties`);
});
