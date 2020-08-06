import { GET, POST, PUT, PATCH } from './utils';
import { PaymentDto } from '@shared/dto';

const create = (data: JSON) => POST('/api/payment', data);
const findByServiceId = (serviceId: number): Promise<PaymentDto.RESPONSE_DATA> =>
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

export { create, findByServiceId, update, softDelete };
