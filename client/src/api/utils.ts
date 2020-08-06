const defaultOptions = (method: string, token?: string) => {
	const options = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (token) {
		options.headers['Authorization'] = token;
	}

	return options;
};

const createParams = (data: Object) => {
	return Object.keys(data).length !== 0
		? '?' +
				Object.keys(data)
					.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
					.join('&')
		: '';
};

const GET = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}${createParams(data)}`, defaultOptions('GET', token));

const HEAD = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}${createParams(data)}`, defaultOptions('HEAD', token));

const POST = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}`, {
		body: JSON.stringify(data),
		...defaultOptions('POST', token),
	});

const PUT = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}`, {
		...defaultOptions('PUT', token),
		body: JSON.stringify(data),
	});

const PATCH = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}`, {
		...defaultOptions('PATCH', token),
		body: JSON.stringify(data),
	});

const DELETE = (uri: string, data: Object, token?: string): any =>
	fetch(`${uri}`, {
		...defaultOptions('DELETE', token),
		body: JSON.stringify(data),
	});

export { GET, POST, PUT, PATCH, HEAD, DELETE };
