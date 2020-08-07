import { POST } from './utils';

// payment_name, service_id
interface bulkPayment {
	data: Array<[string, number]>;
}

//category_name, service_id, for_income
interface bulkCategory {
	data: Array<[string, number, number]>;
}

//price, content, historyDate, category_id, payment_id, service_id
interface bulkHistory {
	data: Array<[number, string, Date, number, number, number]>;
}

const bulkInsertPayment = (data: bulkPayment) => POST('/api/payment/bulk', data);
const bulkInsertCategory = (data: bulkCategory) => POST('/api/category/bulk', data);
const bulkInsertHistory = (data: bulkHistory) => POST('/api/history/bulk', data);

export {
	bulkInsertCategory,
	bulkInsertPayment,
	bulkInsertHistory,
	bulkPayment,
	bulkHistory,
	bulkCategory,
};
