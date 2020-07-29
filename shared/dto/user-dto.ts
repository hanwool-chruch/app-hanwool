interface CREATE {
	email: string;
	name: string;
	image: string | null;
	provider: string;
	password: string;
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
}

export { CREATE, RESPONSE, EMAIL_RESPONSE };
