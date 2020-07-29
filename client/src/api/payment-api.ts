import { GET, POST, PUT, PATCH } from './utils';

const create = (data: JSON) => POST('/api/payment', data);
const findAll = (data: JSON) => GET('/api/payment', data);
const update = (data: JSON) => PUT('/api/payment', data);
const softDelete = (data: JSON) => PATCH(`/api/payment/remove`, data);

export { create, findAll, update, softDelete };
