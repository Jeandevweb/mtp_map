/** Liens externes Google Maps (attend l'ordre "latitude,longitude"). */

export const googleMapsSearch = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

export const googleMapsDirections = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;

/**
 * Ouvre Google Street View (vue au sol, « petit bonhomme ») à la position.
 * `map_action=pano` place directement le panorama sur le point de vue donné.
 */
export const googleStreetView = (lat: number, lng: number) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
