import { mysql } from '../modules/database/mysql';
import { CategoryDto } from '../../../shared/dto';

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

const findByServiceId = async (category: CategoryDto.GET_DATA) => {
	let categoryData;
	try {
		categoryData = await mysql.connect((con: any) =>
			con.query(
				`SELECT category_id, category_name, service_id, for_income, create_date FROM category where category.service_id = '${category.service_id}'`
			)
		);
	} catch (err) {
		throw err;
	}
	return [...categoryData][0];
};

export default {
	create,
	findByServiceId,
};
