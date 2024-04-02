export const linkGoogle = (longitude: number, latitude: number, id: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${longitude},${latitude}&query_place_id=${id}`;
};

export const linkGooglePlus = (longitude: number, latitude: number) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${longitude},${latitude}&origin&travelmode=walking`;
};
