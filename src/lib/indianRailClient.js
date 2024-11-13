import { putInCache, getFromCache } from './cacheManager';

const PNR_STATUS_API_URL = 'https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus';
const STATION_API_URL = 'https://rstations.p.rapidapi.com/v1/railways/stations/india';

async function getStationDetail(workerEnv, stationCode) {
	const cacheKey = `station-${stationCode}`;
	try {
		const cachedData = await getFromCache(workerEnv, cacheKey);
		if (cachedData) {
			return JSON.parse(cachedData);
		}
		const parsedUrl = new URL(STATION_API_URL);
		const response = await fetch(`${STATION_API_URL}`, {
			method: 'POST',
			headers: {
				'x-rapidapi-key': workerEnv.RAPIDAPI_KEY,
				'x-rapidapi-host': parsedUrl.hostname,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ search: stationCode }),
		});

		const data = await response.json();
		await putInCache(workerEnv, cacheKey, JSON.stringify(data), 36000); // Cache for 1 hour
		return data;
	} catch (error) {
		throw error;
	}
}

export { getStationDetail };
