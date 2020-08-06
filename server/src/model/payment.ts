import { mysql } from '../modules/database/mysql';
import { PaymentDto } from '../../../shared/dto';

const FIND_BY_SERVICE_ID =
	'SELECT payment_id, payment_name, service_id, create_date FROM payment where payment.service_id = ? AND payment.delete_date IS NULL';

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

const findByServiceId = async (servicdId: number): Promise<PaymentDto.RESPONSE_DATA> => {
	let paymentData;
	try {
		[paymentData] = await mysql.connect((con: any) => con.query(FIND_BY_SERVICE_ID, [servicdId]));
	} catch (err) {
		throw err;
	}

	return paymentData.map((data: any) => ({
		id: data.payment_id,
		name: data.payment_name,
		service_id: data.service_id,
	}));
};

export default {
	create,
	findByServiceId,
};
