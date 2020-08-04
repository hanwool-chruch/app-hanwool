import { mysql } from '../modules/database/mysql';
import { UserDto } from '@shared/dto';

const findById = async (id: string) => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(`SELECT user_id, name, email, create_date FROM user where user.user_id = '${id}'`)
		);
	} catch (err) {
		throw err;
	}
	return [...userData][0][0];
};

const findByEmail = async (email: string): Promise<UserDto.RESPONSE[]> => {
	let userData;
	try {
		userData = await Promise.all([
			mysql.connect((con: any) =>
				con.query(
					`SELECT u.user_id, u.name, u.email, u.image, u.create_date, p.provider_name FROM user u INNER JOIN email_user p ON u.user_id = p.user_id where u.email = '${email}'`
				)
			),
			mysql.connect((con: any) =>
				con.query(
					`SELECT u.user_id, u.name, u.email, u.image, u.create_date, p.provider_name FROM user u INNER JOIN social_user p ON u.user_id = p.user_id where u.email = '${email}'`
				)
			),
		]);
	} catch (err) {
		throw err;
	}

	return [...userData][0];
};

const findEmailUser = async (email: string): Promise<UserDto.EMAIL_RESPONSE | null> => {
	let userData;
	try {
		userData = await mysql.connect((con: any) =>
			con.query(`SELECT email, password FROM email_user where email = '${email}'`)
		);
	} catch (err) {
		throw err;
	}
	const result = [...userData][0];
	if (result.length) return result[0];
	else return null;
};

const registerUser = async (user: UserDto.CREATE, table: string) => {
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
};
