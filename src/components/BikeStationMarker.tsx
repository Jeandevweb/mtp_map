import { LayerGroup, Marker, Popup } from "react-leaflet";
import { Fragment } from "react/jsx-runtime";
import useBikeStationStore from "../store/useBikeStationStore";
import { BikeInfo } from "../types/bikeInfo";

import { bikeIcon } from "../utils/icons";

const BikeStationMarker = () => {
  const { stations } = useBikeStationStore();
  console.log(stations);

  return (
    <>
      <LayerGroup>
        {stations?.map((station: BikeInfo) => {
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
      </LayerGroup>
    </>
  );
};

export default BikeStationMarker;
