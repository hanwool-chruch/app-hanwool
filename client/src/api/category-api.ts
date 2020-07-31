import { GET, POST, PUT, PATCH } from './utils';
import { CategoryDto } from '../../../shared/dto';

const create = (data: JSON) => POST('/api/category', data);
const findAll = (data: CategoryDto.GET_DATA): any => GET('/api/category', data);
const update = (data: JSON) => PUT('/api/category', data);
const softDelete = (data: JSON) => PATCH(`/api/category/remove`, data);

export { create, findAll, update, softDelete };
