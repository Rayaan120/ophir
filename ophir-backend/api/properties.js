import axios from 'axios';

/**
 * Vercel Serverless Function: /api/properties
 * Handles listing, filtering, and searching properties from PixxiCRM.
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const {
            type,
            hot,
            page: pageQuery,
            pageSize: pageSizeQuery,
            search,
            propertyType,
            bedrooms,
            priceMin,
            priceMax,
            sort
        } = req.query;

        const isHot = hot === 'true';
        const page = parseInt(pageQuery) || 1;
        const pageSize = parseInt(pageSizeQuery) || (isHot ? 6 : 12);

        const PIXXI_API_URL = (process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae').trim();
        const PIXXI_API_KEY = (process.env.PIXXI_CRM_API_KEY || '').trim();

        if (type === 'commercial') {
            return res.status(200).json({ items: [], total: 0, page, pageSize, totalPages: 0 });
        }

        const fetchPixxi = async (listingType, size, currentPage) => {
            const payload = { size, page: currentPage, status: 'ACTIVE' };
            if (listingType) {
                const typeMap = { 'sell': 'SELL', 'rent': 'RENT', 'new': 'NEW' };
                payload.listingType = typeMap[listingType.toLowerCase()] || listingType.toUpperCase();
            }

            const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/v1/properties`, payload, {
                headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
            });
            return {
                list: response.data?.data?.list || [],
                total: response.data?.data?.totalSize || 0
            };
        };

        const fetchSize = 500;
        const result = await fetchPixxi(type, fetchSize, 1);
        const rawProperties = result.list;

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

        // Filtering
        const searchQuery = search?.toLowerCase();
        if (searchQuery) {
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchQuery) ||
                item.location.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery)
            );
        }

        if (propertyType && propertyType !== 'All') {
            items = items.filter(item =>
                item.labels.some(label => label.toLowerCase() === propertyType.toLowerCase())
            );
        }

        if (bedrooms && bedrooms !== 'Any') {
            if (bedrooms === 'Studio') items = items.filter(item => item.bedrooms === 0);
            else if (bedrooms === '4+') items = items.filter(item => item.bedrooms >= 4);
            else {
                const beds = parseInt(bedrooms);
                if (!isNaN(beds)) items = items.filter(item => item.bedrooms === beds);
            }
        }

        const pMin = parseFloat(priceMin);
        const pMax = parseFloat(priceMax);
        if (!isNaN(pMin)) items = items.filter(item => item.price >= pMin);
        if (!isNaN(pMax)) items = items.filter(item => item.price <= pMax);

        // Sorting
        if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
        else items.sort((a, b) => new Date(b.listedOn || 0) - new Date(a.listedOn || 0));

        // Pagination
        const total = items.length;
        const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);
        const totalPages = Math.ceil(total / pageSize) || 1;

        return res.status(200).json({
            items: paginatedItems,
            total,
            page,
            pageSize,
            totalPages
        });

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
}
