export interface Secrets {
	jwtSecret: string;
	clientID: string;
	clientSecret: string;
}

export default function(): Secrets {
	if (process.env.IS_PRODUCTION === 'true') {
		return {
			jwtSecret: process.env.JWT_SECRET,
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET
		};
	} else {
		return {
			...require('./secrets')
		};
	}
}
