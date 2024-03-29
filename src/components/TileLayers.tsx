import { LayersControl, TileLayer } from "react-leaflet";
import { tileLayers } from "../utils/tileLayers";

const TileLayers = () => {
  return (
    <>
      {tileLayers.map((tile) => {
        return (
          <>
            {/* <LayersControl.BaseLayer name={tile.name}> */}
            <TileLayer attribution={tile.attribution} url={tile.url} />
            {/* </LayersControl.BaseLayer> */}
          </>
        );
      })}
    </>
  );
};

export default TileLayers;
