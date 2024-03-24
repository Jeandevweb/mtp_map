export type BikeInfo = {
  address: {
    value: {
      addressCountry: string;
      addressLocality: string;
      streetAddress: string;
    };
  };
  freeSlotNumber: {
    value: number;
  };
  totalSlotNumber: {
    value: number;
  };
  availableBikeNumber: {
    value: string;
  };

  id: string;
  location: {
    value: {
      coordinates: number[];
    };
  };
  status: {
    value: string;
  };
};
