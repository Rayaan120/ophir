import React, { createContext, useState, useEffect, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    // Default to AED
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        const saved = localStorage.getItem('ophir_currency');
        return saved || 'AED';
    });

    const [exchangeRates, setExchangeRates] = useState(null);
    const [isRatesLoading, setIsRatesLoading] = useState(true);

    // Static fallback rates in case API fails
    const fallbackRates = {
        AED: 1,
        USD: 0.272,
        EUR: 0.251,
        GBP: 0.214,
        CAD: 0.368,
        AUD: 0.414,
        INR: 22.6,
        SAR: 1.02
    };

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // In a real app, this would hit an actual backend endpoint
                // const response = await fetch('/api/exchange-rates');
                // const data = await response.json();

                // Simulating an API call with our fallback rates for now
                await new Promise(resolve => setTimeout(resolve, 800));
                setExchangeRates(fallbackRates);
            } catch (error) {
                console.error("Failed to fetch exchange rates, using fallback.", error);
                setExchangeRates(fallbackRates);
            } finally {
                setIsRatesLoading(false);
            }
        };

        fetchRates();
    }, []);

    // Persist choice
    useEffect(() => {
        localStorage.setItem('ophir_currency', selectedCurrency);
    }, [selectedCurrency]);

    const formatPrice = (amount, originalCurrency = 'AED', period = '') => {
        if (amount === null || amount === undefined || isNaN(amount)) return 'Price on Request';

        let convertedAmount = amount;
        let displayCurrency = originalCurrency;

        if (selectedCurrency !== originalCurrency && exchangeRates && exchangeRates[selectedCurrency]) {
            // Convert to AED first if original isn't AED (assuming all base logic points to AED but just in case)
            const amountInAED = originalCurrency === 'AED' ? amount : amount / exchangeRates[originalCurrency];

            convertedAmount = amountInAED * exchangeRates[selectedCurrency];
            displayCurrency = selectedCurrency;
        }

        // Determine formatting options based on currency
        const options = {
            style: 'decimal', // use 'currency' and set currency code if we want strict native formatting, but typically we want more control
            maximumFractionDigits: 0,
        };

        const formattedNumber = new Intl.NumberFormat('en-US', options).format(convertedAmount);

        // Add "Approx." prefix if converted
        let prefix = selectedCurrency !== originalCurrency ? 'Approx. ' : '';

        return `${prefix}${displayCurrency} ${formattedNumber}${period ? ' ' + period : ''}`;
    };

    const getRawConvertedPrice = (amount, originalCurrency = 'AED') => {
        if (!amount || isNaN(amount)) return null;
        if (selectedCurrency === originalCurrency || !exchangeRates) return amount;

        const amountInAED = originalCurrency === 'AED' ? amount : amount / exchangeRates[originalCurrency];
        return amountInAED * exchangeRates[selectedCurrency];
    }

    return (
        <CurrencyContext.Provider value={{
            selectedCurrency,
            setSelectedCurrency,
            exchangeRates,
            isRatesLoading,
            formatPrice,
            getRawConvertedPrice,
            supportedCurrencies: ['AED', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'SAR']
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
