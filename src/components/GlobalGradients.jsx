import React from 'react';

const GlobalGradients = () => {
    return (
        <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
            <defs>
                <linearGradient id="gold-gradient-def" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
                    <stop offset="0%" stopColor="#dbb367" />
                    <stop offset="100%" stopColor="#7a5d1a" />
                </linearGradient>
                <linearGradient id="home-gold-gradient-def" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFD79C" />
                    <stop offset="25%" stopColor="#8D5A1B" />
                    <stop offset="50%" stopColor="#AC7031" />
                    <stop offset="75%" stopColor="#F2CD95" />
                    <stop offset="100%" stopColor="#AC7031" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default GlobalGradients;
