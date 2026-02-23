require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route to fetch hot properties from PixxiCRM
app.get('/api/properties', async (req, res) => {
    try {
        const isHot = req.query.hot === 'true';

        // --- PixxiCRM Integration Logic ---
        // In a real scenario, you would use:
        // const PIXXI_API_URL = process.env.PIXXI_CRM_API_URL;
        // const PIXXI_API_KEY = process.env.PIXXI_CRM_API_KEY;
        // 
        // const response = await axios.get(`${PIXXI_API_URL}/properties?hot=${isHot}`, {
        //     headers: { 'Authorization': `Bearer ${PIXXI_API_KEY}` }
        // });
        // return res.json(response.data);

        // --- Mock Implementation ---
        // Since we don't have real PixxiCRM keys yet, we simulate the exact expected response structure
        // Let's create a slight delay to simulate network request and show off the front-end loading pulse
        await new Promise(resolve => setTimeout(resolve, 800));

        if (isHot) {
            return res.json([
                {
                    id: 1,
                    title: 'Luxury Waterfront Villa',
                    description: 'Stunning 5-bedroom waterfront villa with private beach access and panoramic sea views.',
                    category: 'residential',
                    labels: ['Villa', 'Exclusive'],
                    price: 15500000,
                    pricePeriod: '',
                    currency: 'AED',
                    location: 'Palm Jumeirah, Dubai',
                    bedrooms: 5,
                    bathrooms: 6,
                    areaSqft: 8500,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1613490901237-811550c604be?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'Sarah Jenkins',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
                },
                {
                    id: 2,
                    title: 'Skyline Penthouse Suite',
                    description: 'Ultra-modern penthouse offering 360-degree skyline views and exclusive amenities.',
                    category: 'rent',
                    labels: ['Apartment', 'Duplex'],
                    price: 850000,
                    pricePeriod: 'per year',
                    currency: 'AED',
                    location: 'Downtown Dubai',
                    bedrooms: 4,
                    bathrooms: 4,
                    areaSqft: 4200,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'James Carter',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
                },
                {
                    id: 3,
                    title: 'Premium Corporate Tower',
                    description: 'Grade A commercial office space in the heart of the financial district.',
                    category: 'commercial',
                    labels: ['Office', 'Shell & Core'],
                    price: 120000000,
                    pricePeriod: '',
                    currency: 'AED',
                    location: 'DIFC, Dubai',
                    bedrooms: 0,
                    bathrooms: 12,
                    areaSqft: 45000,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'Elena Rostova',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
                },
                {
                    id: 4,
                    title: 'Golf Course Mansion',
                    description: 'Unparalleled luxury living right on the championship golf course.',
                    category: 'sale',
                    labels: ['Villa', 'Golf View'],
                    price: 28000000,
                    pricePeriod: '',
                    currency: 'AED',
                    location: 'Emirates Hills, Dubai',
                    bedrooms: 6,
                    bathrooms: 7,
                    areaSqft: 12000,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'Michael Chen',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
                },
                {
                    id: 5,
                    title: 'Boutique Retail Space',
                    description: 'High-visibility premium retail space in a luxury shopping avenue.',
                    category: 'commercial',
                    labels: ['Retail', 'F&B Allowed'],
                    price: 450000,
                    pricePeriod: 'per year',
                    currency: 'AED',
                    location: 'City Walk, Dubai',
                    bedrooms: 0,
                    bathrooms: 2,
                    areaSqft: 2800,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1567449303078-57ad995bd3db?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'Sarah Jenkins',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
                },
                {
                    id: 6,
                    title: 'Marina Designer Loft',
                    description: 'Chic, fully furnished designer loft overlooking the luxury yacht marina.',
                    category: 'rent',
                    labels: ['Apartment', 'Furnished'],
                    price: 320000,
                    pricePeriod: 'per year',
                    currency: 'AED',
                    location: 'Dubai Marina',
                    bedrooms: 2,
                    bathrooms: 3,
                    areaSqft: 1900,
                    isHot: true,
                    mainImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
                    agentName: 'James Carter',
                    agentAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
                }
            ]);
        }

        return res.json([]);

    } catch (error) {
        console.error('Error fetching properties from PixxiCRM:', error.message);
        res.status(500).json({ error: 'Failed to fetch properties from CRM' });
    }
});

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running correctly.' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`PixxiCRM API Mock Endpoint active at http://localhost:${PORT}/api/properties`);
});
