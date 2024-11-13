import { Hono } from 'hono';
import { jwtMiddleware } from './lib/jwtMiddleware';
import { getStationDetail } from './lib/indianRailClient';

const app = new Hono();

app.get('/health', (c) => {
	return c.json({ status: 'ok' });
});

app.get('/railway-station', jwtMiddleware, async (c) => {
	const stationCode = c.req.query('station_code');

	if (!stationCode) {
		return c.json({ error: 'station_code is required' }, 400);
	}

	const stationDetail = await getStationDetail(c.env, stationCode);

	return c.json({ status: 'ok', station_detail: stationDetail });
});

export default app;
