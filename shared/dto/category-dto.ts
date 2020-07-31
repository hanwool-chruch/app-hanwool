interface CREATE {
	category_name: string;
	service_id: number;
	for_income: boolean;
}

interface GET_DATA {
	service_id: number;
}

interface RESPONSE_DATA {
	category_id: number;
	category_name: string;
	delete_date: Date;
	create_date: Date;
	service_id: number;
	for_income: boolean;
}

export { CREATE, GET_DATA, RESPONSE_DATA };
