import { GET, POST, PUT, PATCH } from './utils';

const create = async (data: JSON) => await POST('/api/service', data);
const findAll = async (data: JSON) => await GET('/api/service', data);
const softDelete = async (data: JSON) => await PATCH(`/api/service/remove`, data);

export { create, findAll, softDelete };
