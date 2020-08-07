import { GET, POST, PUT, PATCH } from './utils';
import { PaymentDto } from '@shared/dto';
import httpStatus from 'http-status';

const create = (data: JSON) => POST('/api/payment', data);
const findByServiceId = (serviceId: number): Promise<PaymentDto.RESPONSE_DATA> =>
	GET('/api/payment/' + serviceId)
		.then((res) => {
			if (res.status === httpStatus.OK || res.status === httpStatus.NOT_MODIFIED) {
				return res.json();
			} else {
				throw new Error('Error while fetching payments');
			}
		})
		.then((res) => res.result);
const update = (data: JSON) => PUT('/api/payment', data);
const softDelete = (data: JSON) => PATCH(`/api/payment/remove`, data);

export { create, findByServiceId, update, softDelete };
