interface CREATE {
	payment_name: string;
	service_id: number;
}

interface GET_DATA {
	service_id: number;
}

type RESPONSE_DATA = {
	id: number;
	name: string;
	service_id: number;
}[];

export { CREATE, GET_DATA, RESPONSE_DATA };
