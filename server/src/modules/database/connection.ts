import { databaseConfig } from '../../config/consts';

const database = {
	...databaseConfig,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
};

export { database };
