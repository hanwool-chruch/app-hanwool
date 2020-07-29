import { GET, POST, PUT, PATCH } from './utils';

const create = (data: JSON) => POST('/api/service', data);
const findAll = (data: JSON) => GET('/api/service', data);
const softDelete = (data: JSON) => PATCH(`/api/service/remove`, data);

export { create, findAll, softDelete };
