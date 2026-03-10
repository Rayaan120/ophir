import { useEffect } from 'react';
import { useParams, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const LanguageWrapper = () => {
    const { lang } = useParams();
    const { i18n } = useTranslation();
    const location = useLocation();

    // If the language parameter is invalid, let's redirect to English
    if (lang !== 'en' && lang !== 'ar') {
        return <Navigate to="/en" replace />;
    }

    useEffect(() => {
        // Change language in i18next
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        // Set document attributes for styling and RTL
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang, i18n]);

    // Strip current language from pathname for clean hreflang generation
    const pathWithoutLang = location.pathname.replace(`/${lang}`, '');
    const baseUrl = window.location.origin;

    return (
        <>
            <Helmet htmlAttributes={{ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <title>{lang === 'ar' ? 'أوفير للعقارات - عقارات دبي الفاخرة' : 'Ophir Properties - Dubai Luxury Real Estate'}</title>
                <meta name="description" content={lang === 'ar' ? 'اكتشف مجموعة النخبة من العقارات الفاخرة.' : 'Experience an elite portfolio of premium properties.'} />
                <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${pathWithoutLang}`} />
                <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar${pathWithoutLang}`} />
                <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${pathWithoutLang}`} />
            </Helmet>
            <ScrollToTop />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default LanguageWrapper;
