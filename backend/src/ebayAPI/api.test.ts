import { init, ApiItemFromCategory, ApiItemDetail, ApiCategory } from './api';
import getSecrets from '../../config/getSecrets';

const { clientID, clientSecret } = getSecrets();

const ebay = init({ clientID, clientSecret });
describe('getting data from the api', () => {
	let testCategoryResponse: {
		current: ApiCategory;
		children: ApiCategory[];
	};
	let testItemCategory: ApiItemFromCategory;
	let testItemDetail: ApiItemDetail;

	try {
		beforeAll(async () => {
			const cats = await ebay.getCategories(-1);
			testCategoryResponse = cats;
			console.log(`getting items from category: ${cats.children[0].id}`);
			const items = await ebay.getItemsByCategory(cats.children[0].id);
			testItemCategory = items[0];
			console.log(`getting details from item: ${items[0].itemId}`);
			const item = await ebay.getItem(items[0].itemId);
			testItemDetail = item;
		});
	} catch {}

	test('Hits all endpoints without crashing', async () => {
		expect(testCategoryResponse).not.toBeUndefined();
		expect(testItemCategory).not.toBeUndefined();
		expect(testItemDetail).not.toBeUndefined();
	});

	test('Pulls all data from "getCategories"', async () => {
		const res = testCategoryResponse;

		expect(res.current.id).not.toBeUndefined();
		expect(res.current.level).not.toBeUndefined();
		expect(res.current.name).not.toBeUndefined();
		expect(res.current.parentId).not.toBeUndefined();

		expect(res.children[0].id).not.toBeUndefined();
		expect(res.children[0].level).not.toBeUndefined();
		expect(res.children[0].name).not.toBeUndefined();
		expect(res.children[0].parentId).not.toBeUndefined();
	});

	test('Pulls all data from "getItemsByCategory"', async () => {
		expect(testItemCategory.galleryURL).not.toBeUndefined();
		expect(testItemCategory.itemId).not.toBeUndefined();
		expect(testItemCategory.location).not.toBeUndefined();
		expect(testItemCategory.pictureURLLarge).not.toBeUndefined();
		expect(testItemCategory.returnsAccepted).not.toBeUndefined();
		expect(testItemCategory.currentPrice).not.toBeUndefined();
		expect(testItemCategory.title).not.toBeUndefined();
		expect(testItemCategory.topRatedListing).not.toBeUndefined();
		expect(testItemCategory.viewItemURL).not.toBeUndefined();

		// prettier-ignore
		{
    expect(testItemCategory.sellerInfo.feedbackScore).not.toBeUndefined();
    expect(testItemCategory.sellerInfo.positiveFeedbackPercent).not.toBeUndefined();
    expect(testItemCategory.sellerInfo.sellerUserName).not.toBeUndefined();
    expect(testItemCategory.sellerInfo.topRatedSeller).not.toBeUndefined();
    }
	});

	test('Pulls all data from "getItemsByCategory"', async () => {
		expect(testItemDetail.title).not.toBeUndefined();
		expect(testItemDetail.subtitle).not.toBeUndefined();
		expect(testItemDetail.shortDescription).not.toBeUndefined();
		expect(testItemDetail.itemWebUrl).not.toBeUndefined();
		expect(testItemDetail.itemId).not.toBeUndefined();
		expect(testItemDetail.image).not.toBeUndefined();
		expect(testItemDetail.brand).not.toBeUndefined();
		expect(testItemDetail.additionalImages).not.toBeUndefined();

		expect(testItemDetail.seller.feedbackPercentage).not.toBeUndefined();
		expect(testItemDetail.seller.feedbackScore).not.toBeUndefined();
		expect(testItemDetail.seller.username).not.toBeUndefined();

		expect(testItemDetail.price.currency).not.toBeUndefined();
		expect(testItemDetail.price.value).not.toBeUndefined();

		expect(Array.isArray(testItemDetail.localizedAspects)).toBe(true);
	});
});
