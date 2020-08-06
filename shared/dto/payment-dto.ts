interface CREATE {
	service_id: number;
	payment_name: number;
}

interface GET_DATA {
	service_id: number;
}

interface RESPONSE_DATA {
	id: number;
	name: string;
	service_id: number;
}

export { CREATE, GET_DATA, RESPONSE_DATA };
