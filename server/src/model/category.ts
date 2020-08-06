import { mysql } from '../modules/database/mysql';
import { CategoryDto } from '../../../shared/dto';

const FIND_BY_SERVICE_ID = `SELECT category_id, category_name, service_id, for_income, create_date FROM category where category.service_id = ? AND category.delete_date is null`;

const create = async (category: CategoryDto.CREATE) => {
	let categoryData;
	try {
		categoryData = await mysql.connect((con: any) => {
			return con.query(`INSERT INTO category SET ?`, category);
		});
		const category_id = categoryData[0].insertId;
		const result = { ...category, category_id };
		return result;
	} catch (err) {
		throw err;
	}
};

const findByServiceId = async (serviceId: number): Promise<CategoryDto.RESPONSE_DATA | null> => {
	let categoryData;
	try {
		[categoryData] = await mysql.connect((con: any) => con.query(FIND_BY_SERVICE_ID, [serviceId]));
	} catch (err) {
		throw err;
	}
	if (categoryData.length === 0) return null;

	return categoryData.reduce(
		(acc: CategoryDto.RESPONSE_DATA, data: any) => {
			const item = {
				id: data.category_id,
				name: data.category_name,
				service_id: data.servide_id,
				create_date: data.create_date,
			};
			if (data.for_income) acc.income.push(item);
			else acc.outcome.push(item);
			return acc;
		},
		{ income: [], outcome: [] }
	);
};

export default {
	create,
	findByServiceId,
};
