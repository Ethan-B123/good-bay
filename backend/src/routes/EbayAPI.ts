import {
	init,
	ApiItemFromCategory,
	ApiItemDetail,
	ApiCategory
} from '../ebayAPIUtils/api';
import getSecrets from '../../config/getSecrets';
import { Router, Request } from 'express';

const { clientID, clientSecret } = getSecrets();

const ebay = init({ clientID, clientSecret });

const router = Router();

export type ApiCategoryItemsResponse = ApiItemFromCategory[];

export type ApiCategoriesResponse = {
	current: ApiCategory;
	children: ApiCategory[];
};

export type ApiItemResponse = ApiItemDetail;

router.get(
	'/categories/:id/items',
	async (req: Request<{ id: string }>, res) => {
		const items = await ebay.getItemsByCategory(parseInt(req.params.id));
		res.json(items);
	}
);

router.get('/categories/:id', async (req: Request<{ id: string }>, res) => {
	try {
		if (isNaN(parseInt(req.params.id))) throw 'invalid category id';
		const catData = await ebay.getCategories(parseInt(req.params.id));
		res.json(catData);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get('/items/:id', async (req: Request<{ id: string }>, res) => {
	const item = await ebay.getItem(parseInt(req.params.id));
	res.json(item);
});

export default router;
