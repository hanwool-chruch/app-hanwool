import { GET, POST, PUT, PATCH } from './utils';
import { PaymentDto } from '../../../shared/dto';

const create = (data: JSON) => POST('/api/payment', data);
const findAll = (data: PaymentDto.GET_DATA): any => GET('/api/payment', data);
const update = (data: JSON) => PUT('/api/payment', data);
const softDelete = (data: JSON) => PATCH(`/api/payment/remove`, data);

export { create, findAll, update, softDelete };
