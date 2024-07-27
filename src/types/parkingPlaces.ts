export type ParkingPlaces = {
  id: string;
  allowedVehicleType: {
    value: string[];
  };
  availableSpotNumber: {
    value: number;
  };
  category: {
    value: string[];
  };
  layout: {
    type: "StructuredValue";
    value: string[];
  };
  location: {
    value: {
      coordinates: number[];
    };
  };
  name: {
    value: string;
  };
  requiredPermit: {
    value: string;
  };
  status: {
    value: string;
  };
  totalSpotNumber: {
    value: number;
  };
};
