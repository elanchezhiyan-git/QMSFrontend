import {useEffect, useState} from 'react';

export const useCookieConsent = () => {
    const [hasConsented, setHasConsented] = useState<boolean | null>(null);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        setHasConsented(consent === 'true');
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setHasConsented(true);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'false');
        setHasConsented(false);
    };

    return {
        hasConsented,
        acceptCookies,
        declineCookies,
    };
};