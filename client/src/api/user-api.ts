import { POST, GET } from './utils';

const emailSignUp = async (data: JSON) => await POST('/api/user', data);
const emailLogin = async (data: JSON) => await POST('/api/auth/email', data);
const googleLogin = async (data: JSON) => await GET('/api/auth/google', data);
const kakaoLogin = async (data: JSON) => await GET('/api/auth/kakao', data);

export { emailLogin, emailSignUp, googleLogin, kakaoLogin };
