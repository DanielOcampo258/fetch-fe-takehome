import type { Coordinates, LocationApiModel } from '$lib/api/location/models';

export function formatLocationToString(location: LocationApiModel | null) {
	if (!location) return '';
	return `${location.city}, ${location.state}, ${location.zip_code}`;
}

interface BoundingBox {
	bottom_left: Coordinates;
	top_right: Coordinates;
}

// Very rough calculation
export function calculateBoundingBox(lat: number, lon: number, radiusInMiles: number): BoundingBox {
	const EARTH_RADIUS_MILES = 3958.8;

	const radiusInDegrees = (radiusInMiles / EARTH_RADIUS_MILES) * (180 / Math.PI);

	const minLat = lat - radiusInDegrees;
	const maxLat = lat + radiusInDegrees;

	const radiusInLongitude = radiusInDegrees / Math.cos(lat * (Math.PI / 180));
	const minLon = lon - radiusInLongitude;
	const maxLon = lon + radiusInLongitude;

	return {
		bottom_left: { lat: minLat, lon: minLon },
		top_right: { lat: maxLat, lon: maxLon }
	};
}
