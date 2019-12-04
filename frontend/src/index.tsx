import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './pages/App';
import * as serviceWorker from './serviceWorker';
import { login, signup, authGet } from './api/auth';

ReactDOM.render(<App />, document.getElementById('root'));

async function li(un: string) {
	const res = await login({ username: un, pass: 'password' });
	console.log(res);
}

async function su(un: string) {
	const res = await signup({
		username: un,
		pass0: 'password',
		pass1: 'password'
	});
	console.log(res);
}
// @ts-ignore
window.su = su;
// @ts-ignore
window.li = li;
// @ts-ignore
window.authGet = authGet;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
