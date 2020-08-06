import { GET, POST, PUT, PATCH } from './utils';

const create = (data: JSON) => POST('/api/payment', data);
const findByServiceId = (serviceId: number): any =>
	GET('/api/payment/' + serviceId)
		.then((res) => {
			if (res.ok) return res.json();
			else {
				throw new Error('Error while fetching payments');
			}
		})
		.then((res) => res.result);
const update = (data: JSON) => PUT('/api/payment', data);
const softDelete = (data: JSON) => PATCH(`/api/payment/remove`, data);

export { create, findByServiceId as findAll, update, softDelete };
