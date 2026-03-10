import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageRedirect = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there is a cached language, otherwise use detected language, fallback to en
        const lang = i18n.language || window.localStorage.getItem('i18nextLng') || 'en';
        const cleanLang = lang.startsWith('ar') ? 'ar' : 'en';

        navigate(`/${cleanLang}`, { replace: true });
    }, [i18n, navigate]);

    return null; // or a tiny spinner
};

export default LanguageRedirect;
