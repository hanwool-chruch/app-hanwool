import { GET, POST, PUT, PATCH } from './utils';

const create = async (data: JSON) => await POST('/api/payment', data);
const findAll = async (data: JSON) => await GET('/api/payment', data);
const update = async (data: JSON) => await PUT('/api/payment', data);
const softDelete = async (data: JSON) => await PATCH(`/api/payment/remove`, data);

export { create, findAll, update, softDelete };
