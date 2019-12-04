import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useParams
} from 'react-router-dom';
import { Category } from '../components/Category';
import {Item} from "../components/Item"
const Test: React.FC = () => {
	const { id } = useParams();
	return <div>{id}</div>;
};

export const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/categories/:id">
					<Category />
				</Route>
				<Route path="/items/:id">
					<Item />
				</Route>
			</Switch>
		</Router>
	);
};
