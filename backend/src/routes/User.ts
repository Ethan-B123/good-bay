import { Router, Request } from 'express';
import { Connection } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { useJWT, ResponseWithJwt } from '../middlewares/useJWT';
import { sign } from 'jsonwebtoken';
import { User } from '../entity/User';

export const init = (connection: Connection) => {
  const router = Router();

	router.get('/self', useJWT, (req, res: ResponseWithJwt) => {
		const id = res.locals.jwtPayload.id;
		const username = res.locals.jwtPayload.username;
		res.json({ id, username });
	});

	router.post(
		'/signup',
		async (req: RequestWithBody<UserSignupBodyData>, res) => {
			if (req.body.pass0 !== req.body.pass1) {
				const response: UserAuthResponseData = {
					err: true,
					msg: 'passwords must match'
				};
				return res.status(400).json(response);
			}
			const user = new User();
			user.username = req.body.username;
			user.pwd = await hash(req.body.pass0, 10);
			const userRepository = connection.getRepository(User);
			try {
				await userRepository.save(user);
			} catch (err) {
				if (
					err.message ==
					'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.username'
				) {
					const response: UserAuthResponseData = {
						err: true,
						msg: 'Username taken'
					};
					return res.status(400).json(response);
				} else {
					throw err;
				}
			}
			const newToken = createToken(user);
			res.setHeader('token', newToken);
			const response: UserAuthResponseData = {
				jwt: newToken,
				err: false
			};
			res.json(response);
		}
	);

	router.post(
		'/login',
		async (req: RequestWithBody<UserLoginBodyData>, res) => {
			const userRepository = connection.getRepository(User);
			const user = await userRepository.findOne(
				{ username: req.body.username },
				{ select: ['pwd', 'id', 'username'] }
			);
			if (user !== undefined && (await compare(req.body.pass, user.pwd))) {
				const newToken = createToken(user);
				res.setHeader('token', newToken);
				const response: UserAuthResponseData = {
					jwt: newToken,
					err: false
				};
				res.json(response);
			} else {
				const response: UserAuthResponseData = {
					err: true,
					msg: 'invalid username or password'
				};
				res.status(401).json(response);
			}
		}
	);

	return router;
};

function createToken(user: User) {
	return sign({ id: user.id, username: user.username }, 'config.jwtSecret', {
		expiresIn: '1h'
	});
}

export type UserAuthResponseData =
	| {
			err: false;
			jwt: string;
	  }
	| { err: true; msg: string };

export interface UserSignupBodyData {
	username: string;
	pass0: string;
	pass1: string;
}

export interface UserLoginBodyData {
	username: string;
	pass: string;
}

interface RequestWithBody<T> extends Request {
	body: T;
}
