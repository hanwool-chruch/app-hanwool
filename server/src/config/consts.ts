import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../shared/config.env') });

const env = process.env.NODE_ENV || 'development';
const logs = env === 'production' ? 'combined' : 'dev';
const port = process.env.PORT || '3000';
const url = `${process.env.URL || 'http://localhost'}:${port}`;
const web_host = process.env.WEB_HOST || 'http://localhost:5500';
const jwtSecret = process.env.JWT_SECRET || 'secret';
const googleCredentials = {
	clientId: process.env.GOOGLE_CLIENT_ID || '',
	clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
};
const tokenExpiresIn = '6h';

export { env, logs, port, url, jwtSecret, googleCredentials, tokenExpiresIn, web_host };
