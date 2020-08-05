import { POST, GET, HEAD } from './utils';
import { UserDto } from '@shared/dto';

const emailSignUp = (data: UserDto.CREATE): any => POST('/api/auth/email/signup', data);
const emailLogin = (data: UserDto.LOGIN) => POST('/api/auth/email', data);
const googleLogin = (data: JSON) => GET('/api/auth/google', data);
const kakaoLogin = (data: JSON) => GET('/api/auth/kakao', data);
const isValidToken = (data: UserDto.IS_VALID_TOKEN): any => HEAD('/api/auth', {}, data.token);

export { emailLogin, emailSignUp, googleLogin, kakaoLogin, isValidToken };
