import React from 'react';
import { ApiItemFromCategory } from '../../../backend/src/ebayAPIUtils/api';
import { trunc } from '../utils/utils';
import { Link } from 'react-router-dom';
import './IndexItem.css';

interface props {
	item: ApiItemFromCategory;
}

export const IndexItem: React.FC<props> = ({ item }) => {
	const price = parseFloat(item.currentPrice);
	return (
		<div className="item-index-item-root">
			<Link to={`/items/${item.itemId}`}>
				<div className="cat-bg">
					<img src={item.pictureURLLarge} alt="item" />
				</div>
				<section>
					<div className="index-item-title">
						<h3 className="index-item-text-elli">{item.title}</h3>
						<div className="index-item-available">
							<span className="mono">
								{item.sellerInfo.positiveFeedbackPercent}% /{' '}
								{item.sellerInfo.feedbackScore}
							</span>
						</div>
					</div>
					<div className="index-item-price-high">
						<span className="mono">${trunc(price * 1.2)}</span>
					</div>
					<div>
						<span className="mono index-item-price">${trunc(price)}</span>
						<span className="mono index-item-price-save">
							SAVE ${trunc(price * 0.2)}
						</span>
					</div>
					<button>Add to basket</button>
				</section>
			</Link>
		</div>
	);
};
