interface CREATE {
	category_name: string;
	service_id: number;
	for_income: boolean;
}

interface GET_DATA {
	service_id: number;
}

type CategoryDto = {
	id: number;
	name: string;
	create_date: string;
	service_id: number;
};

interface RESPONSE_DATA {
	income: CategoryDto[];
	outcome: CategoryDto[];
}

export { CREATE, GET_DATA, RESPONSE_DATA };
