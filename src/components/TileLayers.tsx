import { LayersControl, TileLayer } from "react-leaflet";

const TileLayers = () => {
  const tileLayers = [
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      name: "Carte Cyclable",
    },
    {
      attribution:
        '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      name: "Carte France",
    },
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      name: "Carte Esri",
    },
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS',
      url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
      name: "Carte Mtb",
    },
  ];

  return (
    <>
      {tileLayers.map((tile) => {
        return (
          <>
            <LayersControl.BaseLayer name={tile.name}>
              <TileLayer attribution={tile.attribution} url={tile.url} />
            </LayersControl.BaseLayer>
          </>
        );
      })}
    </>
  );
};

export default TileLayers;
