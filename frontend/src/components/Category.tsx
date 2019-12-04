import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
	ApiCategoriesResponse,
	ApiCategoryItemsResponse
} from '../../../backend/src/routes/EbayAPI';

export const Category: React.FC = () => {
	const { id } = useParams();
	const [items, setItems] = useState<null | ApiCategoryItemsResponse>(null);
	const [showItems, setShowItems] = useState(false);
	const [catRes, setCatRes] = useState<null | ApiCategoriesResponse>(null);

	useEffect(() => {
		(async () => {
			setShowItems(false);
			setItems(null);
			const res = await fetch(`/ebay/categories/${id}`);
			const data = (await res.json()) as ApiCategoriesResponse;
			setCatRes(data);
		})();
	}, [id]);

	useEffect(() => {
		(async () => {
			if (!showItems) return setItems(null);
			const res = await fetch(`/ebay/categories/${id}/items`);
			const data = (await res.json()) as ApiCategoryItemsResponse;
			setItems(data);
		})();
	}, [showItems]);

	let catElements: string | JSX.Element[] = 'Loading...';
	if (catRes)
		catElements = catRes.children.map(cr => (
			<div key={cr.id}>
				<Link to={`/categories/${cr.id}`}>{cr.name}</Link>
			</div>
		));

	let itemElements: null | JSX.Element[] = null;
	if (items && showItems)
		itemElements = items.map(cr => (
			<div key={cr.itemId}>
				<Link to={`/items/${cr.itemId}`}>{cr.title}</Link>
			</div>
		));
	console.log(showItems);
	console.log(items);
	return (
		<div>
			{catElements}
			<button onClick={() => setShowItems(!showItems)}>Show Items</button>
			{itemElements}
		</div>
	);
};
