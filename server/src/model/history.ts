import { mysql } from '../modules/database/mysql';
import { HistoryDto } from '@shared/dto';

const create = async (history: HistoryDto.AddHistoryDto): Promise<HistoryDto.History> => {
	let historyData;
	const addHistoryData = {
		service_id: history.service_id,
		price: history.price,
		content: history.content,
		history_date: new Date(history.history_date),
		payment_payment_id: history.payment_id,
		category_category_id: history.category_id,
	};

	let payment: string;
	let category: string;
	let history_id: number;
	try {
		historyData = await mysql.connect(async (con: any) => {
			let rows;
			rows = await con.query(`INSERT INTO history SET ?`, addHistoryData);
			history_id = rows[0].insertId;

			[rows] = await con.query('SELECT payment_name FROM payment WHERE payment_id=?', [
				history.payment_id,
			]);
			payment = rows[0].payment_name;

			[rows] = await con.query('SELECT category_name FROM category WHERE category_id=?', [
				history.category_id,
			]);
			category = rows[0].category_name;
		});

		const result = {
			id: history_id!,
			price: history.price,
			content: history.content,
			category: category!,
			payment: payment!,
			historyDate: new Date(history.history_date),
		};
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
