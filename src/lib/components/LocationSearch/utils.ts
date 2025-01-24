import type { LocationApiModel } from '$lib/api/location/models';

export function formatLocationToString(location: LocationApiModel | null) {
	if (!location) return '';
	return `${location.city}, ${location.state}, ${location.zip_code}`;
}
