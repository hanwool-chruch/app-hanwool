import { GET, POST, PUT, PATCH } from './utils';

const create = async (data: JSON) => await POST('/api/category', data);
const findAll = async (data: JSON) => await GET('/api/category', data);
const update = async (data: JSON) => await PUT('/api/category', data);
const softDelete = async (data: JSON) => await PATCH(`/api/category/remove`, data);

export { create, findAll, update, softDelete };
