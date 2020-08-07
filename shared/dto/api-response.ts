export type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export type ApiSuccessResponse = {
	message: string;
	result: any;
};

export type ApiErrorResponse = {
	status: number;
	message: string;
};
