interface CREATE {
	service_id: number;
	payment_name: number;
}

interface GET_DATA {
	service_id: number;
}

interface RESPONSE_DATA {
	payment_id: number;
	payment_name: string;
	delete_date: Date | null;
	create_date: Date;
	service_id: number;
}

export { CREATE, GET_DATA, RESPONSE_DATA };
