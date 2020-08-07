import { mysql } from '../modules/database/mysql';
import { UserDto } from '@shared/dto';

const findById = async (id: number) => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(
				`SELECT user_id, name, email, service_id, create_date FROM user where user.user_id = '${id}'`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...userData][0][0];
};

const findByEmail = async (email: string): Promise<UserDto.RESPONSE[]> => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(
				`SELECT user_id, name, email, image, create_date, service_id FROM user where email = '${email}'`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...userData][0];
};

const findSocialUser = async (email: string): Promise<UserDto.SOCIAL_RESPONSE[]> => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(
				`SELECT social_id, social_email, user_id, provider FROM social_user where social_email = '${email}'`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...userData][0];
};

const findEmailUser = async (email: string): Promise<UserDto.EMAIL_RESPONSE | null> => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(
				`SELECT e.email, e.password, u.user_id, u.service_id FROM email_user e INNER JOIN user u ON e.user_id = u.user_id where e.email = '${email}'`
			)
		);
	} catch (err) {
		throw err;
	}
	const result = [...userData][0];
	if (result.length) return result[0];
	else return null;
};

const registerUser = async (user: UserDto.REGISTER_USER, table: string) => {
	let userData;
	try {
		userData = await mysql.connect((con: any) => {
			return con.query(`INSERT INTO ${table} SET ?`, user);
		});
		const user_id = userData[0].insertId;
		const result = { ...user, user_id };
		return result;
	} catch (err) {
		throw err;
	}
};

export default {
	findById,
	findByEmail,
	findEmailUser,
	registerUser,
	findSocialUser,
};
