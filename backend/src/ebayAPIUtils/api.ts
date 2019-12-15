const Ebay = require('ebay-node-api');
import { getRequest } from '../util/https';

export interface Credentials {
	clientID: string;
	clientSecret: string;
}
export interface ApiCategory {
	name: string;
	id: number;
	level: number;
	parentId: number;
}
export interface ApiItemFromCategory {
	galleryURL: string;
	itemId: number;
	location: string;
	pictureURLLarge: string;
	returnsAccepted: string;
	currentPrice: string;
	title: string;
	topRatedListing: string;
	viewItemURL: string;
	sellerInfo: {
		feedbackScore: string;
		positiveFeedbackPercent: string;
		sellerUserName: string;
		topRatedSeller: string;
	};
}

export interface ApiItemDetail {
	ConditionDisplayName?: string;
	ConvertedCurrentPrice: { Value: number; CurrencyID: string };
	Description: string | null;
	TextDescription: string;
	PrimaryCategoryIDPath: string[];
	ItemID: number; // comes in as string
	ItemSpecifics: { Name: string; Value: string[] }[];
	Location: string;
	PictureURL: string[];
	PrimaryCategoryName: string[];
	Quantity: number;
	QuantityAvailableHint: string;
	QuantitySold: number;
	Subtitle?: string;
	Title: string;
	ViewItemURLForNaturalSearch: string;
	Seller: {
		FeedbackRatingStar: string;
		FeedbackScore: number;
		PositiveFeedbackPercent: number;
		UserID: string;
	};
}

export const init = (cred: Credentials) => {
	const ebay = new Ebay({
		...cred,
		body: {
			grant_type: 'client_credentials',
			scope: 'https://api.ebay.com/oauth/api_scope'
		}
	});

	return {
		async getCategories(id: number = -1) {
			const response = await getRequest(
				`https://api.ebay.com/Shopping?appid=${cred.clientID}&callname=GetCategoryInfo&version=967&siteid=0&responseencoding=JSON&CategoryID=${id}&IncludeSelector=ChildCategories`
			);
			const all: ApiCategory[] = response.CategoryArray.Category.map(
				(category: any) => ({
					name: category.CategoryName,
					id: parseInt(category.CategoryID),
					level: parseInt(category.CategoryLevel),
					parentId: parseInt(category.CategoryParentID)
				})
			);
			return {
				current: all[0],
				children: all.slice(1)
			};
		},
		async getItemsByCategory(id: number) {
			const response = await getRequest(
				`https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=${cred.clientID}&OPERATION-NAME=findItemsByCategory&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&categoryId=${id}&outputSelector(0)=SellerInfo&outputSelector(1)=PictureURLLarge&GLOBAL-ID=EBAY-US`
			);
			const filtered = response.findItemsByCategoryResponse[0].searchResult[0].item.map(
				(item: any) => {
					item.pictureURLLarge = item.pictureURLLarge
						? item.pictureURLLarge
						: item.galleryURL;
					return item;
				}
			);
			const formatted: ApiItemFromCategory[] = filtered.map((item: any) => {
				const out: ApiItemFromCategory = {
					galleryURL: item.galleryURL[0],
					itemId: parseInt(item.itemId[0]),
					location: item.location[0],
					pictureURLLarge: item.pictureURLLarge[0],
					returnsAccepted: item.returnsAccepted[0],
					sellerInfo: {
						feedbackScore: item.sellerInfo[0].feedbackScore[0],
						positiveFeedbackPercent:
							item.sellerInfo[0].positiveFeedbackPercent[0],
						sellerUserName: item.sellerInfo[0].sellerUserName[0],
						topRatedSeller: item.sellerInfo[0].topRatedSeller[0]
					},
					currentPrice: item.sellingStatus[0].currentPrice[0].__value__,
					title: item.title[0],
					topRatedListing: item.topRatedListing[0],
					viewItemURL: item.viewItemURL[0]
				};
				return out;
			});
			return formatted;
		},
		async getItem(id: number) {
			const response = await getRequest(
				`https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=${cred.clientID}&siteid=0&version=967&ItemID=${id}&IncludeSelector=Description,ItemSpecifics,Details,Seller,Subtitle,TextDescription`
			);
			const { Item } = response;
			const retVal: ApiItemDetail = {
				ConditionDisplayName: Item.ConditionDisplayName,
				ConvertedCurrentPrice: Item.ConvertedCurrentPrice,
				Description: Item.TextDescription ? Item.Description : null,
				PrimaryCategoryIDPath: Item.PrimaryCategoryIDPath.split(':'),
				TextDescription: Item.TextDescription
					? Item.TextDescription
					: Item.Description,
				ItemID: parseInt(Item.ItemID),
				ItemSpecifics: Item.ItemSpecifics
					? Item.ItemSpecifics.NameValueList
					: [],
				Location: Item.Location,
				PictureURL: Item.PictureURL,
				PrimaryCategoryName: Item.PrimaryCategoryName.split(':'), // "Cell Phones & Accessories:Cell Phone Accessories:Screen Protectors"
				Quantity: Item.Quantity,
				QuantityAvailableHint: Item.QuantityAvailableHint,
				QuantitySold: Item.QuantitySold,
				Subtitle: Item.Subtitle,
				Title: Item.Title,
				ViewItemURLForNaturalSearch: Item.ViewItemURLForNaturalSearch,
				Seller: Item.Seller
			};
			return retVal;
		}
	};
};
