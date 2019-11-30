const Ebay = require('ebay-node-api');
import { getRequest } from '../util/https';
import getSecrets from '../../config/getSecrets';

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
	title: string;
	subtitle: string;
	shortDescription: string;
	itemWebUrl: string;
	itemId: string; // has v1|#####|0
	image: string;
	brand: string;
	additionalImages: string[];
	seller: {
		feedbackPercentage: string;
		feedbackScore: number; // #of stars
		username: string;
	};
	price: {
		currency: string;
		value: string;
	};
	localizedAspects: {
		name: string;
		value: string;
	}[];
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
				category => ({
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
			const filtered = response.findItemsByCategoryResponse[0].searchResult[0].item.filter(
				item => item.pictureURLLarge
			);
			const formatted: ApiItemFromCategory[] = filtered.map(item => {
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
			await ebay.getAccessToken();
			const data = await ebay.getItem(`v1|${id}|0`);
			const retVal: ApiItemDetail = {
				title: data.title,
				subtitle: data.subtitle || '',
				shortDescription: data.shortDescription,
				seller: {
					feedbackPercentage: data.seller.feedbackPercentage,
					feedbackScore: data.seller.feedbackScore,
					username: data.seller.username
				},
				price: {
					currency: data.price.currency,
					value: data.price.value
				},
				itemWebUrl: data.itemWebUrl,
				localizedAspects: data.localizedAspects,
				itemId: data.itemId,
				image: data.image.imageUrl,
				brand: data.brand,
				additionalImages: data.additionalImages
					? data.additionalImages.map(i => i.imageUrl)
					: []
			};
			return retVal;
		}
	};
};
