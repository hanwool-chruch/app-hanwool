const defaultOptions = (method: string) => {
	return {
		method: method,
		header: {
			'Content-Type': 'application/json',
		},
	};
};

const createParams = (data: JSON) => {
	return data
		? '?' +
				Object.keys(data)
					.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
					.join('&')
		: '';
};

const GET = async (uri: string, data: JSON) =>
	await fetch(`${uri}${createParams(data)}`, defaultOptions('GET'));

const POST = async (uri: string, data: JSON) =>
	await fetch(`${uri}`, {
		...defaultOptions('POST'),
		body: JSON.stringify(data),
	});

const PUT = async (uri: string, data: JSON) =>
	await fetch(`${uri}`, {
		...defaultOptions('PUT'),
		body: JSON.stringify(data),
	});

const PATCH = async (uri: string, data: JSON) =>
	await fetch(`${uri}`, {
		...defaultOptions('PATCH'),
		body: JSON.stringify(data),
	});

export { GET, POST, PUT, PATCH };
