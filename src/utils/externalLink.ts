/** Liens externes Google Maps (attend l'ordre "latitude,longitude"). */

export const googleMapsSearch = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

export const googleMapsDirections = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
