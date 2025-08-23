'use client';

import { useState, useEffect } from 'react';

const KEY = 'cookie_consent_wiki';

export const CookieConsentBanner = () => {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		if (!localStorage.getItem(KEY)) {
			setShowBanner(true);
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem(KEY, 'granted');
		setShowBanner(false);
		if (window.gtag) {
			window.gtag('consent', 'update', {
				ad_storage: 'granted',
				analytics_storage: 'granted',
				ad_user_data: 'granted',
				ad_personalization: 'granted',
			});
		}
	};

	const handleDecline = () => {
		localStorage.setItem(KEY, 'denied');
		setShowBanner(false);
		if (window.gtag) {
			window.gtag('consent', 'update', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied',
			});
		}
	};

	if (!showBanner) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 z-50 ">
			<div className="container mx-auto text-white text-sm">
				<div className="flex gap-3 mb-4">
					
					<h2 className="font-heading text-2xl">We Use Cookies</h2>
				</div>

				<p>
					Our website uses cookies to enhance your experience and for marketing
					purposes. By clicking &quot;Accept&quot;, you consent to our use of
					cookies for personalized ads and analytics.
				</p>
				<div className="flex gap-4 mt-4 justify-end">
					<button
						onClick={handleDecline}
						className="bg-transparent  text-white font-semibold py-2 px-4 hover:underline cursor-pointer"
					>
						Decline
					</button>
					<button
						onClick={handleAccept}
						className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2 px-4 rounded-full cursor-pointer"
					>
						Accept
					</button>
				</div>
			</div>
		</div>
	);
};
