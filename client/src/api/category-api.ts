import { GET, POST, PUT, PATCH } from './utils';
import { CategoryDto } from '../../../shared/dto';

const create = (data: JSON) => POST('/api/category', data);
const findByServiceId = (serviceId: number): Promise<CategoryDto.RESPONSE_DATA> =>
	GET('/api/category/' + serviceId)
		.then((res) => {
			if (res.ok) return res.json();
			else {
				throw new Error('Error while fetching categories');
			}
		})
		.then((res) => res.result);
const update = (data: JSON) => PUT('/api/category', data);
const softDelete = (data: JSON) => PATCH(`/api/category/remove`, data);

export { create, findByServiceId, update, softDelete };
