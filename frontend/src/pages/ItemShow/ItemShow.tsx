import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { ApiItemResponse } from '../../../../backend/src/routes/EbayAPI';
import './ItemShow.css';

export const ItemShow: React.FC = () => {
	const itemDetails = useEbayItem();

	return (
		<>
			<div
				style={{
					height: 100,
					backgroundColor: '#ccc'
				}}
			>
				Test Nav bar
			</div>
			<section className="item-show-root">
				{!itemDetails ? (
					'Loading...'
				) : (
					<>
						<ItemLeftPane item={itemDetails} />
						<ItemRightPane item={itemDetails} />
					</>
				)}
			</section>
			<div
				style={{
					height: 1000,
					backgroundColor: '#ccc'
				}}
			>
				Test Nav bar
			</div>
		</>
	);
};

const ItemLeftPane: React.FC<{ item: ApiItemResponse }> = ({ item }) => {
	console.log(item);
	const img = useMaxImage(item.PictureURL[0], 500, {
		style: { display: 'block', margin: 'auto' }
	});
	return (
		<div className="item-show-left">
			<div className="item-show-pad">{img}</div>
			<div className="item-show-pad">
				<div className="item-show-pad-b">
					<h3>About this product</h3>
					<p>{item.TextDescription}</p>
				</div>
				{!item.ItemSpecifics.length ? null : (
					<div className="item-show-pad-b">
						<h3>Details</h3>
						<ul>
							{item.ItemSpecifics.map(detail => (
								<li>
									<span>✓ {detail.Name}: </span>
									<span>{detail.Value.join(', ')}</span>{' '}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

const ItemRightPane: React.FC<{ item: ApiItemResponse }> = ({ item }) => {
	return (
		<div className="item-show-right">
			<div className="sticky-box">
				<nav>
					{item.PrimaryCategoryName.map((name, i, arr) => (
						<span key={name}>
							<a href={'/categories/' + item.PrimaryCategoryIDPath[i]}>
								{name}
							</a>{' '}
							{i === arr.length - 1 ? '' : ' > '}
						</span>
					))}
				</nav>
				<h1>{item.Title}</h1>
				<div className="item-show-available">
					<span>
						<span className="item-show-mono">{item.Quantity}</span> Available
					</span>
				</div>
				<div className="item-show-price-high">
					<span className="item-show-mono">
						${trunc(item.ConvertedCurrentPrice.Value * 1.2)}
					</span>
				</div>
				<div>
					<span className="item-show-mono item-show-price">
						${trunc(item.ConvertedCurrentPrice.Value)}
					</span>
					<span className="item-show-mono item-show-price-save">
						SAVE ${trunc(item.ConvertedCurrentPrice.Value * 0.2)}
					</span>
				</div>
				<div className="item-show-form">
					<select name="count" id="item-show-count">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
					<button>Add to basket</button>
				</div>
			</div>
		</div>
	);
};

function trunc(n: number) {
	const rounded = `${Math.floor(n * 100) / 100}`;
	const nums = rounded.split('.');
	if (nums.length === 1) nums.push('00');
	nums[1] += '0';
	nums[1] = nums[1].slice(0, 2);
	const withDec = nums.join('.');
	return withDec;
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

function useMaxImage(
	src: string,
	givenMaxWidth: number,
	imageProps: ImageProps = {}
): JSX.Element {
	const image = useRef<HTMLImageElement>(null);
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (!image.current) return;
		image.current.onload = () => {
			setLoaded(true);
		};
	}, [src]);
	let maxWidth = 0;
	if (image.current)
		maxWidth =
			image.current.naturalWidth < givenMaxWidth
				? image.current.naturalWidth
				: givenMaxWidth;

	const styleProps: React.CSSProperties = imageProps.style
		? imageProps.style
		: {};
	const propCopy: ImageProps = { ...imageProps };
	delete propCopy.style;
	delete propCopy.src;
	delete propCopy.style;
	return (
		<img
			ref={image}
			style={{
				...styleProps,
				width: '100%',
				maxWidth
			}}
			src={src}
			alt="item"
			{...propCopy}
		/>
	);
}

function useEbayItem() {
	const { id } = useParams();
	const [itemRes, setItemRes] = useState<null | ApiItemResponse>(null);
	useEffect(() => {
		(async () => {
			const res = await fetch(`/ebay/items/${id}`);
			const data = (await res.json()) as ApiItemResponse;
			setItemRes(data);
		})();
	}, [id]);
	return itemRes;
}
