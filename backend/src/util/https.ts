import * as httpRequest from 'https';

export const getRequest = (url: string): Promise<any> => {
	return new Promise(function(resolve, reject) {
		httpRequest.get(url, res => {
			res.setEncoding('utf8');
			let body = '';
			res.on('data', data => {
				body += data;
			});
			res.on('end', () => {
				const data = JSON.parse(body);
				if (data.errorMessage) {
					reject(body);
				}
				resolve(data);
			});
			res.on('error', error => {
				reject(error);
			});
		});
	});
};
