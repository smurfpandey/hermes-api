/**
 * Puts a value in the KV store.
 * @param {string} key - The key to store the value under.
 * @param {string} value - The value to store.
 * @param {number} expirationTtl - Time to live in seconds.
 */
async function putInCache(workerEnv, key, value, expirationTtl) {
	try {
		await workerEnv.KV_HERMES.put(key, value, { expirationTtl });
	} catch (error) {
		console.error('Error putting value in cache:', error);
		throw error;
	}
}

/**
 * Gets a value from the KV store.
 * @param {string} key - The key to retrieve the value for.
 * @returns {Promise<string|null>} - The value stored under the key, or null if not found.
 */
async function getFromCache(workerEnv, key) {
	try {
		const value = await workerEnv.KV_HERMES.get(key);
		return value;
	} catch (error) {
		console.error('Error getting value from cache:', error);
		throw error;
	}
}

export { putInCache, getFromCache };
