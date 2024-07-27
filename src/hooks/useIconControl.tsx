import bicycle from "../assets/bicycle.svg";
import parking from "../assets/parking.svg";

import useBikeStationStore from "../store/useBikeStationStore";
import useParkingPlacesStore from "../store/useParkingPlacesStore";

const useIconControl = () => {
  const { setisShowStation } = useBikeStationStore();
  const { setisShowPlaces } = useParkingPlacesStore();

  const iconCardControl = [
    {
      name: "bikeStation",
      image: bicycle,
      setter: setisShowStation,
    },
    {
      name: "offStreetParking",
      image: parking,
      setter: setisShowPlaces,
    },
  ];

  return { iconCardControl };
};

export default useIconControl;
