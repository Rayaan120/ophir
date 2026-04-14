import React from 'react';

const GlobalGradients = () => {
    return (
        <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
            <defs>
                <linearGradient id="gold-gradient-def" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
                    <stop offset="0%" stopColor="#dbb367" />
                    <stop offset="100%" stopColor="#7a5d1a" />
                </linearGradient>
                <linearGradient id="home-gold-gradient-def" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e7aa51" />
                    <stop offset="22%" stopColor="#ffe499" />
                    <stop offset="55%" stopColor="#8d5a1b" />
                    <stop offset="80%" stopColor="#ac7031" />
                    <stop offset="100%" stopColor="#e7aa51" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default GlobalGradients;
