interface CREATE {
	service_name: string;
}

interface GET_DATA {
	service_id: number;
}

interface RESPONSE_DATA {
	service_id: number;
	service_name: string;
	create_date: Date;
}

export { CREATE, GET_DATA, RESPONSE_DATA };
