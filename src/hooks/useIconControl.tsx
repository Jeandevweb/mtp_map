import bicycle from "../assets/bicycle.svg";
import parking from "../assets/parking.svg";

import useBikeStationStore from "../store/useBikeStationStore";

const useIconControl = () => {
  const { setisShowStation } = useBikeStationStore();

  const iconCardControl = [
    {
      name: "bikeStation",
      image: bicycle,
      setter: setisShowStation,
    },
    {
      name: "offStreetParking",
      image: parking,
    },
  ];

  return { iconCardControl };
};

export default useIconControl;
