import { ApiResponse } from '@shared/dto/api-response';
const JsonResponse = (message: string, result: any): ApiResponse => {
	return { message, result };
};

export { JsonResponse };
