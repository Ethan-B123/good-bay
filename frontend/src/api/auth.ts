import axios from 'axios';
import {
	UserSignupBodyData,
	UserAuthResponseData,
	UserLoginBodyData
} from '../../../backend/src/routes/User';

export async function authGet<RV>(path: string) {
	if (!localStorage.getItem('jwt')) {
		return false;
	}
	const res = await axios.get(path, {
		headers: {
			Authorization: localStorage.getItem('jwt')
		}
	});
	localStorage.setItem('jwt', res.headers['token']);
	return res.data as RV;
}

export async function authPost<RV>(path: string, data: any) {
	if (!localStorage.getItem('jwt')) {
		return false;
	}
	const res = await axios.post(path, data, {
		headers: {
			Authorization: localStorage.getItem('jwt')
		}
	});
	localStorage.setItem('jwt', res.headers['token']);
	return res.data as RV;
}

export async function login(
	data: UserLoginBodyData
): Promise<UserAuthResponseData> {
	try {
		const res = (await axios.post('/users/login', data))
			.data as UserAuthResponseData;
		if (res.err) {
			return res;
		}
		localStorage.setItem('jwt', res.jwt);
		return res;
	} catch (err) {
		if (err.isAxiosError) {
			return err.response.data;
		}
		return { err: true, msg: 'failed to hit api' };
	}
}

export async function signup(
	data: UserSignupBodyData
): Promise<UserAuthResponseData> {
	try {
		const res = (await axios.post('/users/signup', data))
			.data as UserAuthResponseData;
		if (!res.err) {
			localStorage.setItem('jwt', res.jwt);
		}
		return res;
	} catch (err) {
		if (err.isAxiosError) {
			return err.response.data;
		}
		return { err: true, msg: 'failed to hit api' };
	}
}
