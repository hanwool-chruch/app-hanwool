import { POST, GET } from './utils';

const emailSignUp = (data: JSON) => POST('/api/user', data);
const emailLogin = (data: JSON) => POST('/api/auth/email', data);
const googleLogin = (data: JSON) => GET('/api/auth/google', data);
const kakaoLogin = (data: JSON) => GET('/api/auth/kakao', data);

export { emailLogin, emailSignUp, googleLogin, kakaoLogin };
