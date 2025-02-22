import { useEffect, useState } from 'react';

export const useDeviceType = () => {
	const [deviceType, setDeviceType] = useState('desktop');

	useEffect(() => {
		const userAgent =
			typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
		const isIPad = /iPad/i.test(userAgent) && 'ontouchend' in document;
		const isMobile = /iPhone|iPod|Android/i.test(userAgent) && !isIPad;

		if (isMobile) {
			setDeviceType('mobile');
		} else if (isIPad) {
			setDeviceType('ipad');
		} else {
			setDeviceType('desktop');
		}
	}, []);

	return deviceType;
};
