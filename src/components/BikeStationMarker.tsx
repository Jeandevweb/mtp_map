import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { Fragment } from "react/jsx-runtime";
import useBikeStationStore from "../store/useBikeStationStore";
import { BikeInfo } from "../types/bikeInfo";

import { bikeIcon } from "../utils/icons";
import useGenericStore from "../store/useGenericStore";

const BikeStationMarker = () => {
  const { stations, isShowStation } = useBikeStationStore();

  return (
    <>
      {/* <LayersControl.Overlay checked name="Bike Station"> */}
      {/* <LayerGroup> */}
      {isShowStation &&
        stations?.map((station: BikeInfo) => {
          return (
            <Fragment key={station.id}>
              <Marker
                position={[
                  station.location.value.coordinates[1],
                  station.location.value.coordinates[0],
                ]}
                icon={bikeIcon}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </Fragment>
          );
        })}

      {/* </LayerGroup> */}
      {/* </LayersControl.Overlay> */}
    </>
  );
};

export default BikeStationMarker;
