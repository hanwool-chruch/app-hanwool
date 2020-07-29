import { POST, GET, PATCH, PUT } from './utils';

const create = async (data: JSON) => await POST('/api/history', data);
const findAll = async (data: JSON) => await GET('/api/history', data);
const update = async (data: JSON) => await PUT('/api/history', data);
const softDelete = async (data: JSON) => await PATCH(`/api/history/remove`, data);

export default { create, findAll, update, softDelete };
