import { mysql } from '../modules/database/mysql';
import { HistoryDto } from '@shared/dto';

const create = async (history: HistoryDto.CREATE) => {
	let historyData;
	try {
		historyData = await mysql.connect((con: any) => {
			return con.query(`INSERT INTO history SET ?`, history);
		});
		const history_id = historyData[0].insertId;
		const result = { ...history, history_id };
		return result;
	} catch (err) {
		throw err;
	}
};

const findByMonth = async (history: HistoryDto.GET_DATA) => {
	let historyData;
	try {
		historyData = await mysql.connect((con: any) =>
			con.query(
				`SELECT history_id, price, content, history_date, create_date, update_date, payment_id, category_id, service_id WHERE service_id = ${history.service_id} AND history_date BETWEEN ${history.startDate} AND ${history.endDate}`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...historyData][0];
};

const update = async (history: HistoryDto.UPDATE) => {
	const history_id = history.history_id;
	delete history.history_id;
	let historyData;
	try {
		historyData = await mysql.connect((con: any) =>
			con.query(`UPDATE history SET ? WHERE history_id = ${history_id}`, history)
		);
		const result = { ...history, history_id };
		return result;
	} catch (err) {
		throw err;
	}
};

const remove = async (history: HistoryDto.REMOVE) => {
	let historyData;
	try {
		historyData = await mysql.connect((con: any) =>
			con.query(
				`UPDATE history SET delete_date = ${new Date()} WHERE history_id = ${history.history_id}`
			)
		);
		const history_id = historyData[0].insertId;
		const result = { ...history, history_id };
		return result;
	} catch (err) {
		throw err;
	}
};

export default {
	create,
	findByMonth,
	update,
	remove,
};
