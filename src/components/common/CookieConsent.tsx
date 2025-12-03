import React from 'react';
import {useCookieConsent} from '../../hooks/useCookieConsent';
import {Cookie} from 'lucide-react';

export const CookieConsent: React.FC = () => {
    const {hasConsented, acceptCookies, declineCookies} = useCookieConsent();

    if (hasConsented !== null) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Cookie className="w-6 h-6 text-amber-500"/>
                    <h3 className="text-lg font-semibold text-gray-900">Cookie Consent</h3>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    We use cookies to enhance your experience and provide essential functionality
                    for our Queue Management System. By continuing, you agree to our cookie policy.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={acceptCookies}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Accept Cookies
                    </button>
                    <button
                        onClick={declineCookies}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};