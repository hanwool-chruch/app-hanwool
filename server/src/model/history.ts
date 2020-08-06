import { mysql } from '../modules/database/mysql';
import { HistoryDto } from '@shared/dto';
import { History } from '@shared/dto/history-dto';

const FIND_BY_MONTH =
	'SELECT * FROM history h JOIN category c ON h.category_category_id=c.category_id JOIN payment p ON h.payment_payment_id=p.payment_id WHERE h.service_id=? and h.history_date between ? and ? AND h.delete_date IS NULL ORDER BY h.history_date';

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

const findByMonth = async ({
	serviceId,
	year,
	month,
}: {
	serviceId: number;
	year: number;
	month: number;
}): Promise<History[]> => {
	const startDate = new Date(year, month - 1, 1, 1, 0, 0, 0);
	const endDate = new Date(year, month, 1, 0, 0, 0);

	const escapeDate = (date: Date) => [date.getFullYear(), date.getMonth() + 1, 1].join('-');
	try {
		const [histories] = await mysql.connect((con: any) =>
			con.query(FIND_BY_MONTH, [serviceId, escapeDate(startDate), escapeDate(endDate)])
		);

		return histories.map((data: any) => ({
			id: data.history_id,
			price: data.price,
			content: data.content,
			historyDate: data.history_date,
			category: data.category_name,
			payment: data.payment_name,
		}));
	} catch (err) {
		throw err;
	}
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

const remove = async (historyId: number): Promise<void> => {
	let historyData;
	try {
		[historyData] = await mysql.connect((con: any) =>
			con.query(`UPDATE history SET delete_date = NOW() WHERE history_id = ?`, [historyId])
		);
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
