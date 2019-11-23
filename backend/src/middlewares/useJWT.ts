import { RequestHandler, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import getSecrets from '../../config/getSecrets';

export interface JwtContents {
	id: number;
	username: string;
}

export interface ResponseWithJwt extends Response {
	locals: {
		jwtPayload: JwtContents;
	};
}

const { jwtSecret } = getSecrets();

export const useJWT: RequestHandler = (req, res: ResponseWithJwt, next) => {
	const token = req.headers['authorization'] as string;
	let jwtPayload: JwtContents;

	try {
		jwtPayload = verify(token, jwtSecret) as JwtContents;
		res.locals.jwtPayload = jwtPayload;
	} catch (error) {
		res.status(401).send();
		return;
	}

	const { id, username } = jwtPayload;

	const newToken = sign({ id, username }, jwtSecret, {
		expiresIn: '1h'
	});

	res.setHeader('token', newToken);

	next();
};
