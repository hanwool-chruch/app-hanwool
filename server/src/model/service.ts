import { mysql } from '../modules/database/mysql';
import { ServiceDto } from '../../../shared/dto';

const create = async (service: ServiceDto.CREATE) => {
	let serviceData;
	try {
		serviceData = await mysql.connect((con: any) => {
			return con.query(`INSERT INTO service SET ?`, service);
		});
		const service_id = serviceData[0].insertId;
		const result = { ...service, service_id };
		return result;
	} catch (err) {
		throw err;
	}
};

const findById = async (service: ServiceDto.GET_DATA) => {
	let serviceData;
	try {
		serviceData = await mysql.connect((con: any) =>
			con.query(
				`SELECT service_id, service_name, create_date FROM service where service_id = '${service.service_id}'`
			)
		);
		return [...serviceData][0][0];
	} catch (err) {
		throw err;
	}
};

export default { create, findById };
