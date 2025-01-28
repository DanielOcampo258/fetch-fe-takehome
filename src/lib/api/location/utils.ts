import { authenticatedFetch } from '../utils';
import { LocationRoutes } from './constants';
import type { LocationSearchRequest, LocationSearchResponse } from './models';

export async function getLocationsFromApi(
	searchRequest: LocationSearchRequest
): Promise<LocationSearchResponse> {
	const res = await authenticatedFetch.post(LocationRoutes.getLocationsSearch, searchRequest);
	return res.data;
}
