interface CREATE {
	email: string;
	name: string;
	image: string | null;
	password: string;
}

interface LOGIN {
	email: string;
	password: string;
}

interface IS_VALID_TOKEN {
	token: string;
}
interface CREATE_EMAILUSER {
	email: string;
	password: string;
	provider: string;
	user_id: number;
}

interface RESPONSE {
	user_id: number;
	name: string;
	email: string;
	image: string | null;
	create_date: Date;
	provider: string;
}

interface EMAIL_RESPONSE {
	email: string;
	password: string;
	user_id: number;
	service_id: number;
}

export { CREATE, RESPONSE, EMAIL_RESPONSE, CREATE_EMAILUSER, IS_VALID_TOKEN, LOGIN };
