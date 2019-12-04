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
			const cats = await ebay.getCategories(550);
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
		// expect(testItemDetail.ConditionDisplayName).not.toBeUndefined();
		expect(testItemDetail.ConvertedCurrentPrice).not.toBeUndefined();
		expect(testItemDetail.Description).not.toBeUndefined();
		expect(testItemDetail.ItemID).not.toBeUndefined();
		// expect(testItemDetail.ItemSpecifics).not.toBeUndefined();
		expect(testItemDetail.Location).not.toBeUndefined();
		expect(testItemDetail.PictureURL).not.toBeUndefined();
		expect(testItemDetail.PrimaryCategoryName).not.toBeUndefined();
		expect(testItemDetail.Quantity).not.toBeUndefined();
		expect(testItemDetail.QuantityAvailableHint).not.toBeUndefined();
		expect(testItemDetail.QuantitySold).not.toBeUndefined();
		// expect(testItemDetail.Subtitle).not.toBeUndefined();
		expect(testItemDetail.Title).not.toBeUndefined();
		expect(testItemDetail.ViewItemURLForNaturalSearch).not.toBeUndefined();
		expect(testItemDetail.Seller).not.toBeUndefined();
	});
});
