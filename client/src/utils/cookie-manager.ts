const setCookie = (name: string, value: string, exp: number) => {
	var date = new Date();
	date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
	document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};

const getCookie = (name: string) => {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value ? value[2] : null;
};

const deleteCookie = (name: string) => {
	document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
};

export { setCookie, getCookie, deleteCookie };
