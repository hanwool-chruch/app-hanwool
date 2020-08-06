type REGISTER_USER = CREATE | CREATE_EMAILUSER | CREATE_SOCIALUSER;

interface SIGNUP_EMAIL {
	email: string;
	name: string;
	image: string | null;
	password: string;
}

interface SOCIAL_RESPONSE {
	social_id: string;
	social_email: string;
	user_id: number;
	provider: string;
}

interface CREATE_SOCIALUSER {
	social_email: string;
	social_id: string;
	user_id: number;
	provider: string;
}
interface CREATE {
	email: string;
	name: string;
	image: string | null;
	service_id: number;
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
	service_id: number;
}

interface EMAIL_RESPONSE {
	email: string;
	password: string;
	user_id: number;
	service_id: number;
}

export {
	CREATE,
	RESPONSE,
	EMAIL_RESPONSE,
	CREATE_EMAILUSER,
	IS_VALID_TOKEN,
	LOGIN,
	REGISTER_USER,
	SIGNUP_EMAIL,
	SOCIAL_RESPONSE,
};
