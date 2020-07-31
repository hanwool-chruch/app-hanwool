import { mysql } from '../modules/database/mysql';
import { PaymentDto } from '../../../shared/dto';

const create = async (payment: PaymentDto.CREATE) => {
	let paymentData;
	try {
		paymentData = await mysql.connect((con: any) => {
			return con.query(`INSERT INTO payment SET ?`, payment);
		});
		const payment_id = paymentData[0].insertId;
		const result = { ...payment, payment_id };
		return result;
	} catch (err) {
		throw err;
	}
};

/**
 * todo
 * delete_date null인것만 조회
 */
const findByServiceId = async (payment: PaymentDto.GET_DATA) => {
	let paymentData;
	try {
		paymentData = await mysql.connect((con: any) =>
			con.query(
				`SELECT payment_id, payment_name, service_id, create_date FROM payment where payment.service_id = '${payment.service_id}'`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...paymentData][0];
};

export default {
	create,
	findByServiceId,
};
