import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { ApiItemResponse } from '../../../backend/src/routes/EbayAPI';

export const Item: React.FC = () => {
	const frameEl = useRef<HTMLIFrameElement>(null);
	const { id } = useParams();
	const [itemRes, setItemRes] = useState<null | ApiItemResponse>(null);

	useEffect(() => {
		if (!frameEl.current) return;
		(async () => {
			if (!frameEl.current) return;
			const res = await fetch(`/ebay/items/${id}`);
			const data = (await res.json()) as ApiItemResponse;
			setItemRes(data);
			const document = frameEl.current.contentDocument;
			if (!document) return console.log('return');
			document.body.innerHTML = data.Description
				? data.Description
				: data.TextDescription;
		})();
	}, [id, frameEl.current]);
	let element = itemRes ? 'here' : '';
	console.log(itemRes);

	return (
		<div>
			{element}
			<div>
				<iframe
					style={{
						width: '100%',
						border: '1px solid black',
						height: '500px',
						boxSizing: 'border-box'
					}}
					ref={frameEl}
				></iframe>
			</div>
		</div>
	);
};
