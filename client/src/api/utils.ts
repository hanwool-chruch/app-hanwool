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

const GET = (uri: string, data: JSON) =>
	fetch(`${uri}${createParams(data)}`, defaultOptions('GET'));

const POST = (uri: string, data: JSON) =>
	fetch(`${uri}`, {
		...defaultOptions('POST'),
		body: JSON.stringify(data),
	});

const PUT = (uri: string, data: JSON) =>
	fetch(`${uri}`, {
		...defaultOptions('PUT'),
		body: JSON.stringify(data),
	});

const PATCH = (uri: string, data: JSON) =>
	fetch(`${uri}`, {
		...defaultOptions('PATCH'),
		body: JSON.stringify(data),
	});

export { GET, POST, PUT, PATCH };
