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

// API Route to fetch properties from PixxiCRM
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
            const agent = prop.agent || prop.portalAgent || {};
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
                bedroomMin: params.bedroomMin != null ? parseInt(params.bedroomMin) : null,
                bedroomMax: params.bedroomMax != null ? parseInt(params.bedroomMax) : null,
                bathrooms: params.bathrooms || 1,
                areaSqft: prop.size || 0,
                isHot: isHot,
                mainImageUrl: (prop.photos && prop.photos.length > 0)
                    ? prop.photos[0]
                    : 'https://images.unsplash.com/photo-1613490901237-811550c604be?q=80&w=2000&auto=format&fit=crop',
                agentName: agent.name || 'Ophir Agent',
                agentPhone: agent.phone || '+97140000000',
                agentAvatarUrl: agent.avatar || null,
                listedOn: prop.createTime || prop.updateTime || null,
                developerName: prop.developer || null,
                status: prop.status || null,
                handoverDate: params.handoverTime || null,
                bedroomRange: (params.bedroomMin != null && params.bedroomMax != null) ? `${params.bedroomMin} - ${params.bedroomMax}` : null
            };
        });

        // Save raw items snapshot for meta filter extraction (before user filters applied)
        const rawItems = [...items];

        const extractEmirate = (loc) => {
            if (!loc) return null;
            const parts = loc.split(',');
            return parts.length > 1 ? parts[parts.length - 1].trim() : loc.trim();
        };

        const extractArea = (loc) => {
            if (!loc) return null;
            return loc.split(',')[0].trim();
        };

        const allDevelopers = [...new Set(rawItems.map(i => i.developerName).filter(Boolean))];
        const allEmirates = [...new Set(rawItems.map(i => extractEmirate(i.location)).filter(Boolean))];
        const allAreas = [...new Set(rawItems.map(i => extractArea(i.location)).filter(Boolean))];

        // Apply Server-Side Filtering
        const search = req.query.search?.toLowerCase();
        const propertyType = req.query.propertyType;
        const bedroomsFilter = req.query.bedrooms;
        const priceMin = parseFloat(req.query.priceMin);
        const priceMax = parseFloat(req.query.priceMax);
        const developerFilter = req.query.developer;
        const emirateFilter = req.query.emirate;
        const locationFilter = req.query.location;

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
            items = items.filter(item => {
                const hasRange = item.bedroomMin != null && item.bedroomMax != null;
                if (bedroomsFilter === 'Studio') {
                    if (hasRange) return item.bedroomMin === 0;
                    return item.bedrooms === 0;
                } else if (bedroomsFilter === '4+') {
                    if (hasRange) return item.bedroomMax >= 4;
                    return item.bedrooms >= 4;
                } else {
                    const beds = parseInt(bedroomsFilter);
                    if (isNaN(beds)) return true;
                    if (hasRange) return item.bedroomMin <= beds && item.bedroomMax >= beds;
                    return item.bedrooms === beds;
                }
            });
        }

        if (!isNaN(priceMin)) items = items.filter(item => item.price >= priceMin);
        if (!isNaN(priceMax)) items = items.filter(item => item.price <= priceMax);

        if (developerFilter && developerFilter !== 'All Developers') {
            items = items.filter(item => {
                if (!item.developerName) return false;
                const dev = item.developerName.toLowerCase();
                const filter = developerFilter.toLowerCase();
                return dev === filter || dev.includes(filter) || filter.includes(dev);
            });
        }

        if (emirateFilter && emirateFilter !== 'All Emirates') {
            items = items.filter(item => extractEmirate(item.location) === emirateFilter);
        }

        if (locationFilter && locationFilter !== 'All Areas') {
            items = items.filter(item => extractArea(item.location) === locationFilter);
        }

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
            totalPages,
            meta: {
                developers: allDevelopers,
                emirates: allEmirates,
                areas: allAreas
            }
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

        const property = normalizePropertyDetail(targetProperty);
        console.log(`[Property Detail] ID: ${id}, Agent: ${property.listedBy}, Phone: ${property.agentPhone}`);
        return res.json(property);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch property details' });
    }
});

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
    if (availDate) {
        details.push({ label: 'Availability Date', value: availDate });
    } else if (params.occupancy === 'Vacant') {
        details.push({ label: 'Availability Date', value: 'Immediate' });
    }

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
                else if (value === 'NOT' || value === 'NO') finalValue = 'No';
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
    let agent = prop.agent;
    if (!agent || !agent.phone) agent = prop.portalAgent || {};

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
        listedBy: agent.name || 'Ophir Agent',
        agentPhone: agent.phone || '+97140000000',
        agentEmail: agent.email || 'info@ophir.ae',
        agentAvatarUrl: agent.avatar || null,
        description: prop.description || null,
        bedrooms: prop.bedRooms || 0,
        bathrooms: params.bathrooms || 1,
        areaSqft: prop.size || 0,
        labels: prop.propertyType && prop.propertyType.length > 0 ? prop.propertyType : ['Exclusive']
    };
}

// Contact Form Submission
app.post(['/api/contact', '/contact'], async (req, res) => {
    try {
        const { fullName, email, phone, interest, budget, message, areas, source, agentEmail, agentName } = req.body;
        if (!fullName || !email || !phone || !message) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        const isRent = interest?.toLowerCase().includes('rent');
        const formId = isRent ? '45427db2-8760-4b4a-88a6-a244d7a91e35' : '6507a47f-9443-494c-a288-64381315f14b';
        const formName = isRent ? 'Property Booster' : 'Ophir Properties Website Lead Form';

        let subjectPrefix = '';
        const lowerInterest = interest?.toLowerCase() || '';
        if (lowerInterest.includes('selling')) subjectPrefix = '[SELLER] ';
        else if (lowerInterest.includes('new projects') || lowerInterest.includes('off-plan')) subjectPrefix = '[NEW PROJECTS] ';
        else if (lowerInterest.includes('general')) subjectPrefix = '[GENERAL] ';
        else if (isRent) subjectPrefix = '[RENT] ';
        else subjectPrefix = '[BUY] ';

        const webhookPayload = {
            name: fullName,
            email,
            phone,
            subject: `${subjectPrefix}Website Inquiry: ${interest || 'General'}`,
            message: `Lead Details:\n- Interest: ${interest || 'N/A'}\n- Budget: ${budget || 'N/A'}\n- Preferred Areas: ${areas || 'N/A'}\n\nMessage:\n${message}`,
            source: source || 'Ophir Website',
            formId,
            formName,
            date: new Date().toISOString(),
            assignedAgentEmail: agentEmail || null,
            assignedAgentName: agentName || null
        };

        if (isRent) webhookPayload.propertyId = '1021201523387';

        console.log('Sending lead to PixxiCRM:', JSON.stringify(webhookPayload, null, 2));

        await axios.post(`${PIXXI_API_URL}/pixxiapi/webhook/v1/form`, webhookPayload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY, 'Content-Type': 'application/json' },
            timeout: 10000
        });

        res.json({ success: true, message: 'Thank you for your enquiry. An advisor will contact you shortly.' });
    } catch (error) {
        console.error('Contact Form Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to submit enquiry. Please try again or contact us via WhatsApp.' });
    }
});

// Instagram Feed API (Secure Proxy)
app.get(['/api/instagram/latest', '/instagram/latest'], async (req, res) => {
    try {
        const limit = req.query.limit || 3;
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        const feedUrl = process.env.INSTAGRAM_FEED_URL;

        if (feedUrl) {
            const response = await axios.get(feedUrl);
            const rawPosts = Array.isArray(response.data) ? response.data : (response.data.posts || []);
            const posts = rawPosts.slice(0, limit).map(post => {
                const type = post.mediaType || post.media_type || 'IMAGE';
                const proxiedUrl = post.sizes?.medium?.mediaUrl || post.sizes?.full?.mediaUrl || post.sizes?.large?.mediaUrl;
                const directUrl = post.mediaUrl || post.media_url;
                const thumbUrl = post.thumbnailUrl || post.thumbnail_url;
                const displayUrl = proxiedUrl || (type === 'VIDEO' ? (thumbUrl || directUrl) : directUrl) || thumbUrl;
                return {
                    id: post.id,
                    mediaType: type,
                    mediaUrl: displayUrl,
                    permalink: post.permalink,
                    caption: post.caption || '',
                    timestamp: post.timestamp
                };
            });
            return res.json(posts);
        }

        if (accessToken) {
            const response = await axios.get(`https://graph.instagram.com/me/media`, {
                params: {
                    fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
                    access_token: accessToken,
                    limit: limit
                }
            });
            const posts = response.data.data.map(post => {
                const type = post.media_type || 'IMAGE';
                const displayUrl = type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;
                return {
                    id: post.id,
                    mediaType: type,
                    mediaUrl: displayUrl,
                    permalink: post.permalink,
                    caption: post.caption || '',
                    timestamp: post.timestamp
                };
            });
            return res.json(posts);
        }

        console.warn('No Instagram configuration found in .env');
        return res.status(503).json({ error: 'Instagram integration not configured.' });
    } catch (error) {
        console.error('Instagram API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch Instagram feed.' });
    }
});

app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'API is live', timestamp: new Date() }));

export default app;
