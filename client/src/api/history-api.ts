import { POST, GET, PATCH, PUT } from './utils';

const create = (data: JSON) => POST('/api/history', data);
const findAll = (data: JSON) => GET('/api/history', data);
const update = (data: JSON) => PUT('/api/history', data);
const softDelete = (data: JSON) => PATCH(`/api/history/remove`, data);

export default { create, findAll, update, softDelete };
