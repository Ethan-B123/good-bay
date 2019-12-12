import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useParams
} from 'react-router-dom';
import { Category } from '../components/Category';
// import { Item } from '../components/Item';
import { ItemShow } from './ItemShow/ItemShow';

export const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/categories/:id">
					<Category />
				</Route>
				<Route path="/items/:id">
					<ItemShow />
				</Route>
			</Switch>
		</Router>
	);
};
