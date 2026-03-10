import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import './CurrencySelector.css';

const CurrencySelector = () => {
    const { selectedCurrency, setSelectedCurrency, supportedCurrencies } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (currency) => {
        setSelectedCurrency(currency);
        setIsOpen(false);
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="currency-selector" ref={dropdownRef}>
            <button
                className={`currency-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="currency-current">{selectedCurrency}</span>
                <ChevronDown size={14} className="currency-icon" />
            </button>

            {isOpen && (
                <div className="currency-dropdown animate-fade-in-up" role="listbox">
                    <div className="currency-dropdown-header">
                        <span>Select Currency</span>
                    </div>
                    <ul className="currency-list">
                        {supportedCurrencies.map((currency) => (
                            <li
                                key={currency}
                                className={`currency-item ${selectedCurrency === currency ? 'selected' : ''}`}
                                onClick={() => handleSelect(currency)}
                                role="option"
                                aria-selected={selectedCurrency === currency}
                            >
                                <span className="currency-code">{currency}</span>
                                {selectedCurrency === currency && <Check size={14} className="check-icon" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
