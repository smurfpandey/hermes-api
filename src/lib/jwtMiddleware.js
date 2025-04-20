import { jwtVerify } from 'jose';

async function getKey(header) {
	const response = await fetch(`https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`);
	const { keys } = await response.json();
	const key = keys.find((key) => key.kid === header.kid);
	if (!key) {
		throw new Error('Key not found');
	}
	return key;
}

export const jwtMiddleware = async (c, next) => {
	const authHeader = c.req.header('Authorization');
	if (!authHeader) {
		return c.json({ error: 'Authorization header is missing' }, 401);
	}

	const token = authHeader.split(' ')[1];
	if (!token) {
		return c.json({ error: 'Token is missing' }, 401);
	}

	try {
		const { payload } = await jwtVerify(token, (header) => getKey(header, c.env), {
			audience: c.env.AUTH0_AUDIENCE,
			issuer: `https://${c.env.AUTH0_DOMAIN}/`,
		});

		c.req.user = payload; // Attach the decoded user to the request object
		await next();
	} catch (error) {
		return c.json({ error: 'Invalid token' }, 401);
	}
};
